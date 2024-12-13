// Backend corrigé avec support des mises à jour par PATCH
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Connexion à MongoDB
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectuée");
});

mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});

mongoose.connect("mongodb://127.0.0.1:27017/VIP_Cocktail_db");

const Personne = mongoose.model('Personne', { prenom: String, nom: String, status: Boolean }, 'personnes');

const app = express();

// Middleware JSON
app.use(express.json());
// Activez CORS pour toutes les origines
app.use(cors());
// Routes
app.get('/personnes', async (request, response) => {
    const personnes = await Personne.find();
    if (personnes.length === 0) {
        return response.json({ code: "701" });
    }
    return response.json(personnes);
});

app.get('/personnes/:id', async (request, response) => {
    const idParam = request.params.id;
    const foundPersonne = await Personne.findById(idParam);
    if (!foundPersonne) {
        return response.json({ code: "702" });
    }
    return response.json(foundPersonne);
});

app.post('/personnes', async (request, response) => {
    const personneJson = request.body;
    const personne = new Personne(personneJson);
    await personne.save();
    return response.json(personne);
});

app.patch('/personnes/:id', async (request, response) => {
    const idParam = request.params.id;
    const updates = request.body;
    try {
        const updatedPersonne = await Personne.findByIdAndUpdate(idParam, updates, { new: true });
        if (!updatedPersonne) {
            return response.status(404).json({ code: "702", message: "Personne non trouvée" });
        }
        return response.json(updatedPersonne);
    } catch (error) {
        return response.status(500).json({ code: "703", message: "Erreur lors de la mise à jour", error: error.message });
    }
});

app.delete('/personnes/:id', async (request, response) => {
    try {
        const idParam = request.params.id;
        const suppPersonne = await Personne.findByIdAndDelete(idParam);
        if (!suppPersonne) {
            return response.status(404).json({ code: "702", message: "Personne non trouvée" });
        }
        return response.json({ code: "200", message: "Personne supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return response.status(500).json({ code: "704", message: "Erreur lors de la suppression", error: error.message });
    }
});

// Démarrage du serveur
app.listen(3000, () => {
    console.log("Le serveur a démarré sur le port 3000");
});
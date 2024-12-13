const dbMongo = "http://127.0.0.1:3000/";
const noeud = "personnes";

let data = {}; // Stockage local des données

class Personne {
    constructor(prenom, nom) {
        this.prenom = prenom;
        this.nom = nom;
        this.status = true;
    }
}

const afficherHTML = () => {
    const tbody = document.getElementById("myTbody");
    tbody.innerHTML = "";
    data.forEach(p => {
        const template = document.getElementById("templateTr");
        const clone = template.content.cloneNode(true);
        const tr = clone.querySelector("tr");
        tr.setAttribute('data-id', p._id);

        p.status
            ? tr.classList.add("table-success")
            : tr.classList.add("table-danger");

        const td = clone.querySelectorAll("td");
        td[0].textContent = p.prenom;
        td[1].textContent = p.nom;

        const btnEnlever = clone.querySelector(".btn-danger");
        btnEnlever.onclick = async (evt) => {
            const tr = evt.target.closest("tr");
            const id = tr.dataset.id;
            const url = `${dbMongo}${noeud}/${id}`;
            await axios.delete(url);
            data = data.filter(person => person._id !== id);
            afficherHTML();
        };

        const btnModifier = clone.querySelector(".btn-warning");
        btnModifier.onclick = async (evt) => {
            const tr = evt.target.closest("tr");
            const id = tr.dataset.id;
            const obj = { status: !p.status };
            const url = `${dbMongo}${noeud}/${id}`;
            const response = await axios.patch(url, obj);
            const updatedPerson = response.data;
            const index = data.findIndex(person => person._id === id);
            data[index] = updatedPerson;
            afficherHTML();
        };

        tbody.appendChild(clone);
    });
};

document.getElementById("btnAjouter").onclick = async () => {
    const prenom = document.getElementById("prenom").value;
    const nom = document.getElementById("nom").value;
    document.getElementById("prenom").value = "";
    document.getElementById("nom").value = "";
    const newPerson = new Personne(prenom, nom);
    const url = `${dbMongo}${noeud}`;
    const response = await axios.post(url, newPerson);
    data.push(response.data);
    afficherHTML();
};

const loadMongo = async () => {
    const url = `${dbMongo}${noeud}`;
    const response = await axios.get(url);
    data = response.data;
    if (Array.isArray(data)) {
      afficherHTML();
    } else {
      console.warn("Aucune donnée trouvée :", data);
    }
};

loadMongo();
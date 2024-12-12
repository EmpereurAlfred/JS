const tab1 = Array.from({ length: 12 }, (_, i) => i);//créé un tableau de 12 valeurs
let tab2 = [...tab1, ...tab1];// créé le tableau2 en ajoutant deux fois le tableau 1

function melange(array) { //fonction de mélange de valeurs du tableau
    for (let i = array.length - 1; i > 0; i--) { //prend la longueur du tableau
        const j = Math.floor(Math.random() * (i + 1));//randomisation
        [array[i], array[j]] = [array[j], array[i]];//encore plus de randomisation
    }
    return array;//retourne mon mélange (important pour le jeu)
}

const body = document.querySelector('body');//selectionne le body (pour plus tard)
const container = document.querySelector('.container');//selectionne le container dans le html
let carte1 = null;//définis les cartes et le tableau 
let carte2 = null;
let tableau = false;
let paires = 0;//initialise la paire a 0
let startTimer = null;//créé la variable pour le timer

function Jeu() {
    container.innerHTML = '';//réinitialise le container pour éviter les bugs de génération infini
    tab2 = melange([...tab1, ...tab1]);//mélange les cartes
    paires = 0;//reset les paires pour éviter les bugs
    startTimer = Date.now();//on commence le timer
    tab2.forEach((value, index) => {//fonction qui créé les cartes et les ajoute au container pour les afficher dans le html
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = `<img src="img/${value}.webp" alt="Image ${value}">`;//incrémente le index pour le nom de l'image
        container.appendChild(card);
        card.addEventListener('click', Clickage);
    });
}
function Clickage(e) {//la fonction qui s'occupe de la gestion du clique
    if (tableau) return; //permet a la fonction d'exister uniquement si le tableau existe
    const card = e.currentTarget;//définis la "carte" cliqué
    if (card === carte1) { //si la carte est la meme on annule tout les clics
        card.classList.remove('selected');
        carte1 = null;
        carte2 = null;
        return;
    }
    card.classList.add('selected');//on ajoute la class "selected" a la carte cliqué pour la mettre en surbrillance
    if (!carte1) {//si il n'y a pas encore de premiere carte cliqué on la définis sur celle la
        carte1 = card;
        return;
    }
    carte2 = card;//sinon c'est la carte 2 qui est définis
    checkPaires();
}
function checkPaires() {//la fonction qui va vérifier si la paire est correcte
    const paire = carte1.dataset.value === carte2.dataset.value;//définis ce qu'est une paire
    if (paire) { //si la paire est valider on cache les cartes
        cacher();
        paires++;
        if (paires === tab1.length) {//si toute les paires sont trouvées on lance la victoire
            setTimeout(victoire);
        }
    } else {
        deselection();//si on ne trouve pas de paires on lance la déselection
    }
}
function cacher() {//fonction qui permet de cacher les cartes
    setTimeout(() => {
        carte1.classList.add('matched');//on ajoute aux deux cartes la classe "matched"
        carte2.classList.add('matched');
        carte1.classList.remove('selected');//on enleves aux cartes la classe "selected" pour eviter la surbrillance
        carte2.classList.remove('selected');
        carte1.innerHTML = '';//on efface les cartes
        carte2.innerHTML = '';
        resetTableau();
    });
}
function deselection() {//fonction de deselection des cartes en cas de non paire
    tableau = true;
    setTimeout(() => {
        carte1.classList.remove('selected');//enleve la surbrillance
        carte2.classList.remove('selected');
        resetTableau();
    });
}
function resetTableau() {
    [carte1, carte2, tableau] = [null, null, false];//on remet les cartes en null
}
function victoire() {//fonction qui définis la victoire
    const tempspasse = ((Date.now() - startTimer) / 1000).toFixed(1);//arret du timer et définition du temps qu'on à mis a résoudre le memory
    body.innerHTML = ` 
    <div class="apres">
        <div class="win-message">
            <p>Temps : ${tempspasse} secondes</p>
        </div>
        <div class="winimg">
            <img src="imgpoulit.jpg" alt="Image de victoire">
        </div>
        <div class="button">
            <button id="restart-button">Recommencer</button>
        </div>
    </div>
    `;  //création d'un html pour l'écran de victoire / affichage du temps qu'on à mis a résoudre le memory / affichage du 
    const audio1 = new Audio('audio/victorysound.mp3');//définis une musique de triomphe
    const audio2 = new Audio('audio/victoryvoice.mp3');
    audio1.play();//lance la musique de triomphe
    setTimeout(() => audio2.play(), 2000);
   document.getElementById('restart-button').onclick = () => {//refresh la page quand on clique parce que le reste marchais pas
     location.reload(), false;
 };
}
Jeu();//lance le jeux
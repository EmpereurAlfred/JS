const p1 = {prenom:'Brad', nom:'pitt',statuts:true}
class Personne {
    constructor(prenom,nom){
        this.nom=nom;
        this.prenom=prenom;
    }
}
const p2 = new Personne('tom','cruise');
const personnes = [];
personnes.push(p1);

"use strict";

window.onload = init;

import { pathRessources } from "./utils.js";

let $plateau = $("#plateau-jeu");
let parties = JSON.parse(localStorage.getItem("parties")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
let theme;
let taille;
if (!currentUser.preferences) {
    theme = 2;
    taille = 6;
} else {
    theme = Number.parseInt(currentUser.preferences.theme);
    taille = Number.parseInt(currentUser.preferences.taille);
}
const NBPAIRES = taille;
console.log(`NBPAIRES : ${NBPAIRES}`)
const NBCARTES = NBPAIRES * 2;
let srcImgCartes = [];
let srcCartes = []; //tableau qui contiendra 2 sources d'images de chaque image
console.log(`pathRessources[theme] : ${pathRessources[theme]}`)
choisirDeckCartes

let cartesRetournees = []; //tableau qui contiendra les sources des deux images retournées pour comparaison
let nbPairesDecouvertes = 0;
let nbTours = 0;
let messageGagnant;
let plateauCartes;
let $bodyMeilleursScores = $("#body-meilleurs-scores");

function init() {
    miseEnPlacePlateau();
    afficherTableauMeilleursScores();
    $("body").on("keypress", demarrerMemory);
    $plateau.on("click", ".flip-card-inner", avancerJeu);
}

//Cette fonction permet de choisir une combinaison aléatoire des images au sein du thème choisi par l'utilisateur
function choisirDeckCartes() {
    let choixCartes = new Set();
    while (choixCartes.size < NBPAIRES) {
        let area = Math.floor(Math.random() * pathRessources[theme].length);
        console.log(`area:${area}`)
        choixCartes.add(area);
    }
    let choixDeck = Array.from(choixCartes)

    for (let i = 0; i < choixDeck.length; i++) {
        srcImgCartes.push(pathRessources[theme][choixDeck[i]])
    };
    console.log(srcImgCartes)
    for (let k = 0; k < srcImgCartes.length; k++) {
        srcCartes.push(srcImgCartes[k]);
    }
    for (let k = 0; k < srcImgCartes.length; k++) {
        srcCartes.push(srcImgCartes[k]);
    }
}

//Cette fonction permet de créer et disposer les cartes au hasard sur le plateau de jeu
function miseEnPlacePlateau() {
    if (taille >= 12) {
        $("#zone-jeu").css("maxWidth", "1400px");
    }
    //création d'un ordre aléatoire des cartes
    let ordreCartes = new Set();
    while (ordreCartes.size < NBCARTES) {
        let area = Math.floor(Math.random() * NBCARTES);
        ordreCartes.add(area);
    }
    plateauCartes = Array.from(ordreCartes);
    //création et disposition des cartes sur le plateau
    choisirDeckCartes()
    for (let i = 0; i < NBCARTES; i++) {
        let flipCard = $("<div></div>"); //container de la carte
        flipCard
            .attr("i", `flip-card-${i}`)
            .addClass("flip-card")
            .addClass("m-2")
            .addClass("p-2")
        let flipCardInner = $("<div></div>"); //élément sur lequel on va "coller" les 2 faces visibles de la carte
        flipCardInner
            .attr("i", `flip-card-inner-${i}`)
            .addClass("flip-card-inner")
            .addClass("rounded")
            .css("backgroundColor", "#212529");
        flipCardInner.css("pointer-events", "none"); //les cartes ne sont pas cliquables au départ
        let flipCardBack = $("<div></div>"); //dos de la carte
        flipCardBack
            .attr("id", `flip-card-back${i}`)
            .addClass("flip-card-back")
            .addClass("rounded")
            .addClass("d-flex");
        flipCardBack.html(
            `<img src="../assets/feuilles.png" width=75% height=75% alt="envers de la carte de memory" class="position-absolute top-50 start-50 translate-middle">`
        );
        let pathImg = "../assets/"; //chemin vers l'image
        let card = $("<div></div>"); //image de la carte
        card.attr("id", `#card-${i}`);
        card
            .attr("id", `card-${i}`)
            .addClass("col")
            .addClass("flip-card-Memory")
            .addClass("rounded");
        pathImg += srcCartes[plateauCartes[i]];
        card.html(
            `<img src=${pathImg} width=75% height=75% alt="endroit de la carte de memory" class=" bg-dark img-Memory position-absolute top-50 start-50 translate-middle">`
        );
        flipCardInner.val(`${pathImg}`); //on donne une valeur aux flipCardInner pour les comparer 2 à 2 lors d'une partie
        //assemblage des différentes parties de la carte
        flipCardInner.append(card);
        flipCardInner.append(flipCardBack);
        flipCard.append(flipCardInner);
        $plateau.append(flipCard);
    }
}

//Cette fonction permet de réinitialiser un plateau pour commencer un jeu
function demarrerMemory(event) {
    if (event.code === "Space" || event.keyCode === 32) {
        //"vidage" de tout le contenu du plateau de jeu et d'un éventuel message de victoire
        $plateau.empty();
        $("#divGagnant").empty();
        //réinitialisation des variables évoluant pendant le jeu
        nbPairesDecouvertes = 0;
        nbTours = 0;
        $("#message-nb-tours").html("0");
        cartesRetournees = [];
        //création du plateau et activation de l'évènement "click" sur les cartes
        srcImgCartes = [];
        srcCartes = [];
        miseEnPlacePlateau();
        $(".flip-card-inner").css("pointer-events", "auto");
    }
}

//Cette fonction permet de jouer en retournant les cartes et de détecter la fin du jeu
function avancerJeu() {
    if (cartesRetournees.length < 2) {
        $(this).css("pointer-events", "none"); //on bloque l'évènement "click" sur la carte au moins jusqu'au retournement d'une paire
        $(this).css("transform", "rotateY(180deg)");
        $(this).addClass("retournee");
        cartesRetournees.push($(this).val());
        if (cartesRetournees.length === 2) {
            nbTours++;
            $("#message-nb-tours").empty();
            $("#message-nb-tours").html(`${nbTours}`);
            if (cartesRetournees[0] != cartesRetournees[1]) {
                setTimeout(() => {
                    //on retourne les paires non identiques dos visible après 1 seconde
                    $(".retournee").css("pointer-events", "auto");
                    $(".retournee").css("transform", "rotateY(0deg)");
                    $(".retournee").removeClass("retournee");
                    cartesRetournees = [];
                }, 1000);
            } else {
                // les 2 cartes sont identiques
                nbPairesDecouvertes++;
                $(".retournee").addClass("decouvertes");
                $(".retournee").removeClass("retournee");
                cartesRetournees = [];
            }
        }
    }
    if (nbPairesDecouvertes === NBPAIRES) {
        messageGagnant = $("<div></div>");
        messageGagnant.html(`
            <h2 class="text-center row-cols-1 row-cols-sm-2 row-cols-md-4" style="width:100%">Bravo ! Vous avez gagné en ${nbTours} tours.</h2>`);
        $("#divGagnant").append(messageGagnant);
        enregistrerPartie()
        afficherTableauMeilleursScores()
    }
}

//Cette fonction permet d'enregistrer la partie dans le localStorage
function enregistrerPartie() {
    let dateJour = new Date().toLocaleDateString()
    let partieEnCours = {
        nom: currentUser.nom,
        date: dateJour,
        nbCoups: nbTours,
        taille: NBPAIRES
    }
    parties.push(partieEnCours);
    localStorage.setItem("parties", JSON.stringify(parties));
}

//Cette fonction permet d'afficher les 5 meilleurs scores parmi toutes les parties de tous les joueurs
function afficherTableauMeilleursScores() {
    /**classement des parties
    * Le classement se fait sur le nombre de coups/nombre de paires (croissant), 
    * puis sur la taille décroissante en cas d'égalité (/le temps une fois la fonctionnalité mise en place),
    * puis sur le temps*/
    const nbMaxAffichage = 5;
    const partiesOrdonnees = [...parties];
    partiesOrdonnees.sort((a, b) => {
        if (a.nbCoups / a.taille !== b.nbCoups / b.taille) {
            return (a.nbCoups / a.taille) - (b.nbCoups / b.taille);
        } else if (a.taille !== b.taille) {
            return (b.taille - a.taille);
        } else {
            return (a.temps - b.temps);
        }
    });
    $bodyMeilleursScores.empty()
    if (partiesOrdonnees.length > 0) {
        for (let i = 0; i < Math.min(nbMaxAffichage, partiesOrdonnees.length); i++) {
            let rowPartie = $("<tr></tr>");
            rowPartie.html(`
            <th scope="row" class="text-center">${i + 1}</th>
            <td>${partiesOrdonnees[i].nom}</td>
            <td>${partiesOrdonnees[i].nbCoups}</td>
            <td>${partiesOrdonnees[i].taille}</td>
            <td>${partiesOrdonnees[i].temps}</td>
            `);
            $bodyMeilleursScores.append(rowPartie);
        }
    } else {
        let absencePartie = $("<p></p>")
        absencePartie.html("Soyez le premier à jouer").css("fontSize", "1.3rem");
        $("#container-meilleurs-scores").append(absencePartie);
    }
}
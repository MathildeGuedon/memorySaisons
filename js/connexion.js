"use strict";

window.onload = init;

function init() {
    $("#btn-soumission-connexion").on("click", connecterUtilisateur);
}

//Cette fonction permet de vérifier l'existence puis la bonne correspondance des coordonnées
//En cas de succès, l'utilisateur est connecté à sa page profil
function connecterUtilisateur(event) {
    event.preventDefault();
    let $emailConnexion = $("#email-utilisateur-connexion");
    let $mdpConnexion = $("#mot-de-passe-connexion");
    let users = JSON.parse(localStorage.getItem("users")) || []; //récupération des objets "user" enregistrés
    if (users.length === 0) {
        alert(
            "Aucun profil n'a été créé pour le moment, vous allez être redirigé vers la page d'inscription"
        );
        window.location.href = "inscription.html";
        return;
    } else {
        let correspondance = false;
        for (let user of users) {
            if (user.email === $emailConnexion.val()) {
                if (user.motDePasse === $mdpConnexion.val()) {
                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify({ email: $emailConnexion.val(), nom: user.nom })
                    );
                    correspondance = true;
                    //création d'un cookie nommé justConnected valable 60 secondes et accessible depuis tout le site
                    document.cookie = "justConnected=true; max-age=60; path=/";
                    window.location.href = "compte.html";
                    break;
                }
            }
        }
        if (!correspondance) {
            let messageErreurSaisie = $(`<p id="message-erreur-saisie" >Erreur, veuillez saisir les informations correctement</p>`)
            $("#body").append(messageErreurSaisie)
            setTimeout(() => { messageErreurSaisie.fadeOut(500) }, 3000);
        }

    }

}
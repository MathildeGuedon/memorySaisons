"use strict";

window.onload = init;

let $nomUser = $("#nom-utilisateur");
let $emailUser = $("#email-utilisateur");
let $mdp = $("#mot-de-passe");

function init() {
    $("#nom-utilisateur").on("input", verifierValiditePseudo);
    $("#email-utilisateur").on("input", verifierValiditeEmail);
    $("#mot-de-passe").on("input", verifierValiditePW);
    $("#mot-de-passe-confirmation").on("input", verifierConfirmationPW);
    $("#btn-soumission-inscription").on("click", inscrireUtilisateur);

}

//Cette fonction vérifie que le nom d'utilisateur possède au moins 3 caractères et affiche un message si ce n'est pas le cas
function verifierValiditePseudo() {
    if ($("#nom-utilisateur").val().length < 3) {
        $("#validation-nom-utilisateur").removeClass("invisible");
        $("#validation-nom-utilisateur").addClass("visible");
        $("#nom-utilisateur").removeClass("is-valid");
        $("#nom-utilisateur").addClass("is-invalid");
    } else {
        $("#validation-nom-utilisateur").removeClass("visible");
        $("#validation-nom-utilisateur").addClass("invisible");
        $("#nom-utilisateur").removeClass("is-invalid");
        $("#nom-utilisateur").addClass("is-valid");
    }
}

//Cette fonction vérifie que l'adresse mail est valide et affiche un message si ce n'est pas le cas
function verifierValiditeEmail() {
    let regex = /[a-z0-9\-._]+@[a-z0-9._\-]+\.[a-z0-9._-]+/;
    if (regex.test($("#email-utilisateur").val())) {
        //si l'email ne passe pas le test, on affiche le message
        $("#validation-email-utilisateur").removeClass("visible");
        $("#validation-email-utilisateur").addClass("invisible");
        $("#email-utilisateur").removeClass("is-invalid");
        $("#email-utilisateur").addClass("is-valid");
    } else {
        $("#validation-email-utilisateur").removeClass("invisible");
        $("#validation-email-utilisateur").addClass("visible");
        $("#email-utilisateur").removeClass("is-valid");
        $("#email-utilisateur").addClass("is-invalid");
    }
}

//Cette fonction vérifie que le mot de passe contient au moins une lettre, un chiffre et 6 caractères
function verifierValiditePW() {
    const MINLENGTHPW = 6;
    let verifCar = 0;
    let regexCar = /[!-/:-@]/; //plages ascii : du 33 au 47 et du 58 au 64
    let verifChiffre = 0;
    let regexChiffre = /\d/;
    let verifNbCar = 0;
    let sommeVerif;
    const PALIERFAIBLE = 6;
    const PALIERFORT = 9;

    //Vérification du symbole
    if (regexCar.test($("#mot-de-passe").val())) {
        verifCar = 1;
    }
    //Vérification du chiffre
    if (regexChiffre.test($("#mot-de-passe").val())) {
        verifChiffre = 1;
    }
    //Vérification de la longueur du mdp
    if ($("#mot-de-passe").val().length >= MINLENGTHPW) {
        verifNbCar = 1;
    }
    //Si toutes les contraintes sont respectées : le mdp obtient la classe is-valid
    sommeVerif = verifCar + verifChiffre + verifNbCar;
    if (sommeVerif >= 3) {
        $("#mot-de-passe").removeClass("is-invalid");
        $("#mot-de-passe").addClass("is-valid");
    } else {
        $("#mot-de-passe").removeClass("is-valid");
        $("#mot-de-passe").addClass("is-invalid");
    }
    if ($("#mot-de-passe").val().length > 0) {
        //affichage du premier palier dès que l'utilisateur commence à saisir le mot de passe
        $("#progress-bar-mdp").css("visibility", "visible");
        $("#progress-bar-mdp-jauge").css("width", "33%");
        $("#text-mdp-faible").css("visibility", "visible");
    } else {
        $("#progress-bar-mdp-jauge").css("width", "0%");
        $("#text-mdp-faible").css("visibility", "hidden");
    }
    if (
        $("#mot-de-passe").val().length >= PALIERFAIBLE &&
        (verifCar === 1 || verifChiffre === 1)
    ) {
        $("#progress-bar-mdp-jauge").css("background", "linear-gradient(90deg, rgb(1, 51, 48)0%, rgb(1, 85, 81)50%, rgb(2, 161, 161)100%)")
        $("#progress-bar-mdp-jauge").css("width", "66%")
        $("#text-mdp-moyen").css("visibility", "visible");
    } else {
        $("#text-mdp-moyen").css("visibility", "hidden");
    }
    if (
        $("#mot-de-passe").val().length >= PALIERFORT &&
        verifCar === 1 &&
        verifChiffre === 1
    ) {
        $("#progress-bar-mdp-jauge").css("width", "100%");
        $("#text-mdp-fort").css("visibility", "visible");
    } else {
        $("#text-mdp-fort").css("visibility", "hidden");
    }
}

//Cette fonction vérifie que le 2e mot de passe a la même valeur que le premier
function verifierConfirmationPW() {
    if ($("#mot-de-passe-confirmation").val() === $("#mot-de-passe").val()) {
        $("#mot-de-passe-confirmation").removeClass("is-invalid");
        $("#mot-de-passe-confirmation").addClass("is-valid");
    } else {
        $("#mot-de-passe-confirmation").removeClass("is-valid");
        $("#mot-de-passe-confirmation").addClass("is-invalid");
    }
}

//Cette fonction enregistre les données d'un nouvel utilisateur dans le localStorage
//après vérification de la validité des données et de l'absence d'un compte déjà existant
function inscrireUtilisateur(event) {
    event.preventDefault();
    let formulaireValide = false;
    let absenceCompteExistant = false;
    //vérification conformité formulaire
    if (
        !(
            $("#nom-utilisateur").hasClass("is-valid") &&
            $("#email-utilisateur").hasClass("is-valid") &&
            $("#mot-de-passe").hasClass("is-valid") &&
            $("#mot-de-passe-confirmation").hasClass("is-valid")
        )
    ) {
        let messageErreurSaisie = $(`<p id="message-erreur-saisie" classe="rounded">Erreur, au moins l'un des champs du formulaire n'est pas valide</p>`)
        $("#bloc-mot-de-passe").append(messageErreurSaisie)
        setTimeout(() => { messageErreurSaisie.fadeOut(500) }, 3000);
    } else {
        formulaireValide = true;
        //vérification absence de nom ou email déjà existant dans le localStorage
        let users = JSON.parse(localStorage.getItem("users")) || []; //récupération de l'objet "users" enregistré en local
        let tableNoms = [];
        let tableEmails = [];
        if (users != []) {
            for (let user of users) {
                //récupération des noms et emails déjà enregistrés
                tableNoms.push(user.nom);
                tableEmails.push(user.email);
            }
        }
        if (
            tableNoms.includes($nomUser.val()) ||
            tableEmails.includes($emailUser.val())
        ) {
            let messageRedondanceSaisie = $(`<p id="message-redondance-saisie" classe="rounded">Votre pseudo ou votre email est déjà utilisé. Veuillez modifier vos données</p>`)
            $("#bloc-mot-de-passe").append(messageRedondanceSaisie)
            setTimeout(() => { messageRedondanceSaisie.fadeOut(500) }, 3000);
        } else {
            absenceCompteExistant = true;
        }
        //enregistrement dans le localStorage
        if (formulaireValide === true && absenceCompteExistant === true) {
            let lastUser = {
                //création d'un objet contenant les données de l'enregistrement en cours
                nom: $nomUser.val(),
                email: $emailUser.val(),
                motDePasse: $mdp.val(),
                scores: [],
                preferences: {},
            };
            users.push(lastUser); //ajout du dernier utilisateur à l'objet contenant tous les comptes utilisateurs
            localStorage.setItem("users", JSON.stringify(users)); //transformation de l'objet JS pour stockage
            localStorage.setItem(
                "currentUser",
                JSON.stringify({ email: $emailUser.val(), nom: $nomUser.val() })
            );
            document.cookie = "justConnected=true; max-age=60; path=/";// création d'un cookie qui affichera un message de bienvenue sur le profil
            document.location.replace("compte.html");
            //ou window.location.href = "compte.html";
        }
    }
}
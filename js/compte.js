"use strict";

window.onload = init;

let currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
$("#nom-utilisateur-connexion").html(currentUser.nom); //affichage du nom du joueur connecté
$("#email-connexion").html(currentUser.email); //affichage de l'email du joueur connecté
let $choixThemeJeu = "0"; //thème du jeu par défaut
let $choixTailleJeu = "6"; //taille du jeu par défaut
let parties = JSON.parse(localStorage.getItem("parties")) || [];
let $bodyScoresJoueur = $("#body-scores-joueur");

function init() {
    afficherMessageBienvenue()
    afficherTableauScoresPerso()
    $("#select-choix-set-memory").on("change", $("option"), afficherMiniature);
    $("#select-choix-taille-memory").on("change", $("option"), choisirTailleMemory);
    $("#btn-validation-param-jeu").on("click", enregistrerParamJeu);
}

//Cette fonction permet d'afficher un message flash lors de la connexion d'un joueur
function afficherMessageBienvenue() {
    if (currentUser.length === 0) {
        return
    } else {
        //on vérifie que l'utilisateur vient de se connecter (c'est-à-dire que le cookie justConnected existe),
        //puis on affiche le message pendant quelques secondes si c'est le cas
        const justConnected = document.cookie.split(";").find(c => c.startsWith("justConnected="));
        if (justConnected) {
            let messageBienvenue = $(`<p id="message-bienvenue" >Bienvenue ${currentUser.nom} !</p>`)
            $("#body").append(messageBienvenue)
            setTimeout(() => { $("#message-bienvenue").fadeOut(500) }, 3000);
            document.cookie = "justConnected=; path=/; max-age=5";
        }
    }
}

//Cette fonction permet d'afficher une image regroupant les vignettes du thème sélectionné
function afficherMiniature() {
    $choixThemeJeu = $(this).val();
    console.log(`choixThèmeJeu : ${$choixThemeJeu}`)
    switch ($choixThemeJeu) {
        case "0":
            $("#affichage-miniature-memory").empty();
            $("#affichage-miniature-memory").html(
                `<img src="../assets/automne/citrouille.png" height="150px">`
            );
            break;
        case "1":
            $("#affichage-miniature-memory").empty();
            $("#affichage-miniature-memory").html(
                `<img src="../assets/hiver/flocon.png" height="150px">`
            );
            break;
        case "2":
            $("#affichage-miniature-memory").empty();
            $("#affichage-miniature-memory").html(
                `<img src="../assets/printemps/jonquille.png" height="150px">`
            );
            break;
        case "3":
            $("#affichage-miniature-memory").empty();
            $("#affichage-miniature-memory").html(
                `<img src="../assets/ete/ananas.png" height="150px">`
            );
            break;
        // case "animaux-domestiques":
        //     $("#affichage-miniature-memory").empty();
        //     $("#affichage-miniature-memory").html(
        //         `<img src="../assets/animauxdomestiques/memory_detail_animaux_domestiques.png" height="200px">`
        //     );
        //     break;
        // case "chiens":
        //     $("#affichage-miniature-memory").empty();
        //     $("#affichage-miniature-memory").html(
        //         `<img src="../assets/chiens/memory_details_chiens.png" height="200px">`
        //     );
        //     break;
        // case "dinosaures-sans-nom":
        //     $("#affichage-miniature-memory").empty();
        //     $("#affichage-miniature-memory").html(
        //         `<img src="../assets/dinosaures/memory_detail_dinosaures.png" height="200px">`
        //     );
        //     break;
        // case "dinosaures-avec-nom":
        //     $("#affichage-miniature-memory").empty();
        //     $("#affichage-miniature-memory").html(
        //         `<img src="../assets/dinosauresAvecNom/memory_details_dinosaures_avec_nom.png" height="200px">`
        //     );
        //     break;
        // default: //legumes
        //     $("#affichage-miniature-memory").empty();
        //     $("#affichage-miniature-memory").html(
        //         `<img src="../assets/memory-legume/memory_detail.png" height="200px">`
        //     );
        //     break;
    }
    // let messageEnregistrementParam = $("<p></p>");
    // messageEnregistrementParam.html(`Préférences enregistrées`);
    // messageEnregistrementParam.attr("id", "message-enregistrement-param-jeu")
    // messageEnregistrementParam.addClass("p-2").addClass("rounded");
    let messageEnregistrementParam = $(`<p id="message-enregistrement-param-jeu" class="p-2 rounded">Préférences enregistrées</p>`);
    $("#affichage-miniature-memory").append(messageEnregistrementParam);
}

//Cette fonction permet de récupérer la taille du jeu désirée par le joueur
function choisirTailleMemory() {
    $choixTailleJeu = $(this).val();
}

//Cette fonction permet d'enregistrer les préférences de thème et de taille du jeu
function enregistrerParamJeu() {
    // $choixThemeJeu = $("#select-choix-set-memory")
    //     .find("option[selected]")
    //     .val();
    console.log($choixThemeJeu)
    console.log($choixTailleJeu)
    // $choixTailleJeu = $("#select-choix-taille-memory")
    //     .find("option[selected]")
    //     .val();
    console.log($choixTailleJeu)
    currentUser.preferences = {
        theme: $choixThemeJeu,
        taille: $choixTailleJeu,
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    $("#message-enregistrement-param-jeu").css("display", "inline");
    setTimeout(() => { $("#message-enregistrement-param-jeu").fadeOut(500) }, 1000);
    // alert("Préférences enregistrées!");
}

function afficherMessageFlashParamJeu() {

}

//Cette fonction permet d'afficher les scores du joueur connectées classées par défaut de la meilleure à la moins bonne
function afficherTableauScoresPerso() {
    let maxPartiesJoueur = 10; //nombre max de parties affichées (les dernières dans l'ordre chronologiques)
    let partiesCurrentJoueur = [];
    //récupération de toutes les parties du joueur
    for (let partie of parties) {
        if (partie.nom === currentUser.nom && currentUser.nom) {
            partiesCurrentJoueur.push(partie);
        }
    }
    /**classement des parties
    * Le classement se fait sur le nombre de coups/nombre de paires (croissant), 
    * puis sur la taille décroissante en cas d'égalité (/le temps une fois la fonctionnalité mise en place),
    * puis sur le temps*/
    let partiesOrdonnees = [...partiesCurrentJoueur];
    // for (let partie of partiesOrdonnees) {
    //     partie.taille = Number.parseInt(resultat.taille)//transformation d'une String en integer
    // }
    if (partiesOrdonnees.length > 0) {
        partiesOrdonnees.sort((a, b) => {
            if (partiesOrdonnees.length > maxPartiesJoueur) {
                partiesOrdonnees.sort((c, d) => {
                    return d.date - c.date
                })
                partiesOrdonnees = partiesOrdonnees.slice(0, maxPartiesJoueur);
            }
            console.log(`partiesOrdonnees: ${partiesOrdonnees}`)
            if (a.nbCoups / a.taille !== b.nbCoups / b.taille) {
                return (a.nbCoups / a.taille) - (b.nbCoups / b.taille);
            } else if (a.taille !== b.taille) {
                return (b.taille - a.taille);
            } else {
                return (a.temps - b.temps);
            }
        });
        //création et affichage du tableau du joueur
        // let tableauScoreJoueur = $("<table></table>")
        // tableauScoreJoueur.html(`
        //     <thead>
        //         <tr>
        //             <th scope="col">Rang</th>
        //             <th scope="col">Score</th>
        //             <th scope="col">Taille</th>
        //             <th scope="col">Temps</th>
        //             <th scope="col">Date</th>
        //         </tr>
        //     </thead>
        //     <tbody id="body-scores-joueur">
        //     </tbody>
        // `);
        // tableauScoreJoueur.addClass()
        $bodyScoresJoueur.empty()
        for (let i = 0; i < partiesOrdonnees.length; i++) {
            let rowPartie = $("<tr></tr>");
            rowPartie.html(`
            <th scope="row" class="text-center">${i + 1}</th>
            <td>${partiesOrdonnees[i].nbCoups}</td>
            <td>${partiesOrdonnees[i].taille}</td>
            <td>${partiesOrdonnees[i].temps}</td>
            <td>${partiesOrdonnees[i].date}</td>
            `);
            $bodyScoresJoueur.append(rowPartie);
            //tableauScoreJoueur.append(rowPartie);
        }
    } else {
        //let absencePartie = $("<tr></tr>");
        // absencePartie.attr("colspan", "5").addClass("text-center").addClass("table-striped").addClass("table-success");
        // absencePartie.attr("id", "absencePartie")
        // absencePartie.html("Jouez une partie pour l'afficher ici")
        //let absencePartie.html(`<tr colspan="5">Jouez une partie pour l'afficher ici</tr>`)
        // $bodyScoresJoueur.addClass("d-flex").addClass("justify-content-center")
        // $bodyScoresJoueur.append(absencePartie);
        //$("table").append(absencePartie);
        //tableauScoreJoueur.append(rowPartie);
        let absencePartie = $("<p></p>")
        absencePartie.html("Enregistrez-vous et jouez une partie pour l'afficher ici").css("fontSize", "1.3rem");
        $("#container-table").append(absencePartie);
    }

}
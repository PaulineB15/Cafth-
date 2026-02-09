// Client router
// Chemin : api/clients

const express = require("express"); // Express framework qui fait tourner le serveur
const router = express.Router(); // Router pour gérer les routes liées aux clients (panneau signalisation)
const {register, login} = require("../controllers/ClientController"); // Importation des fonctions de gestion des clients


// INSCRIPTION D'UN CLIENT
// Quand l'appli reçoit une requête POST sur l'adresse "/register"
// (POST = on envoie des données cachées, pas dans l'URL)
// POST api/clients/register
// Body: {nom, prenom, email, mot_de_passe} pour mettre dans Postman
/*
{
    "nom":"Bennoin",
    "prenom":"Pauline",
    "email":"pauline@email.com",
    "mot_de_passe":"paupau"
}
 */

router.post( "/register", register); // Active la fonction register du Controller


//ROUTE DE CONNEXION
// POST /api/clients/login
//Body : {email, mot_de_passe} pour mettre dans postman
// Retourne un token JWT
/*
{
    "email":"pauline@email.com",
    "mot_de_passe":"paupau"
} */

router.post( "/login", login);

module.exports = router;
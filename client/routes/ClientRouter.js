// Client router
// Chemin : api/clients

const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/ClientController");

// Inscription d'un client
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

router.post( "/register", register);

//Connexion
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
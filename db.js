// Permet de configurer le pool de connexion à MsQL
// pour faire des requêtes asynchrones async/await

const mysql = require("mysql2/promise");
require('dotenv').config();

// Pool de connexions
// Permet de gérer plusieurs connexions simultanées
// Réutiliser des connexions existantes
// Gestion automatique de la disponibilité
// Limite le nombre de connexions en même temps

const db = mysql.createPool( {
// Paremetre de connexion

    // (host, nom d'utilisateur, mot de passe, nom de la bdd, ect..)
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,

    // PARAMETRE DU POOL
    // si plus de connexions dispo alors elles attendent
    waitForConnections: true,
    //Limiter le nb max de connexions
    connectionLimit: 10,

    // PARAMETRE OPTIONNELS mais recommandés
    // En cas d'echec de connexion, réessayer
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    //Timeout de connexion (milliesecondes)
    connectTimeout:10000, //10 secondes
});


(async () => {
   try {
       const connection = await db.getConnection();
       console.log("Connecté à la base de données MySQL");

       // se déconnecter
       connection.release();
   } catch (err){
       console.error("Erreur de connexion à MySQL : ", err.message);

       // arrête l'application avec code erreur 1
       process.exit(1);
   }
})();

module.exports = db;


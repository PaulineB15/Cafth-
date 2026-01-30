// Model client

const db = require("../../db");
const bcrypt = require("bcryptjs");

// Rechercher un client par email
const findClientByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM client WHERE EMAIL_CLIENT = ?", [email]);
    return rows;
};

// Créer un nouveau client
const createClient = async (clientData) => {
    const { nom,
        prenom,
        tel,
        email,
        mot_de_passe,
        adresse_facturation,
        cp_facturation,
        ville_facturation,
        adresse_livraison,
        cp_livraison,
        ville_livraison
    } = clientData;


const [result] = await db.query(
    `INSERT INTO client (NOM_CLIENT, PRENOM_CLIENT, ADRESSE_FACTURATION, CP_FACTURATION, VILLE_FACTURATION, ADRESSE_LIVRAISON, CP_LIVRAISON, VILLE_LIVRAISON, TEL_CLIENT, EMAIL_CLIENT, MDP_CLIENT )
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ nom,
        prenom,
        adresse_facturation || null,
        cp_facturation || null,
        ville_facturation || null,
        adresse_livraison || null,
        cp_livraison || null,
        ville_livraison || null,
        tel,
        email,
        mot_de_passe,
    ],
);
return result;
};

// Hacher un mot de passe // --> npm install bcryptjs dans le terminal pour installer
const hashPassword = async (password) => {
   const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
   return await bcrypt.hash(password, rounds);
   // return await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
};


//Comparer un mot de passe (haché et non haché)
const comparedPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};



module.exports = {findClientByEmail, createClient, hashPassword, comparedPassword};
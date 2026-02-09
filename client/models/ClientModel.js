// Model client

// Import à la connexion à la base de données
const db = require("../../db");
// Import bcrypt pour hacher le mot de passe
const bcrypt = require("bcryptjs");

// RECHERCHER UN CLIENT PAR EMAIL
const findClientByEmail = async (email) => {
    // Le ? est un placeholder de sécurité.
    // MySQL va remplacer le ? par la variable [email] proprement pour éviter les piratages.
    const [rows] = await db.query("SELECT * FROM client WHERE EMAIL_CLIENT = ?", [email]);
    return rows; // Retourne un tableau (soit vide [], soit avec le client trouvé [client])
};

// CREER UN NOUVEAU CLIENT
const createClient = async (clientData) => {
    // Extraction de toutes les données reçues du client
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

// Faire la requête SQL d'insertion (INSERT INTO)
// Plein de ? pour chaque colonne
const [result] = await db.query(
    `INSERT INTO client (NOM_CLIENT, PRENOM_CLIENT, ADRESSE_FACTURATION, CP_FACTURATION, VILLE_FACTURATION, ADRESSE_LIVRAISON, CP_LIVRAISON, VILLE_LIVRAISON, TEL_CLIENT, EMAIL_CLIENT, MDP_CLIENT )
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    // L'ordre ici doit être EXACTEMENT le même que les ?
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
return result; // Contient l'ID du nouveau client (insertId)
};

// Hacher un mot de passe // --> npm install bcryptjs dans le terminal pour installer
const hashPassword = async (password) => {
    // Le "salt rounds" (10), c'est la complexité du mélange.
    // Plus c'est haut, plus c'est sûr, mais plus c'est lent. 10 est le standard.
    // C'est comme transformer une pomme en compote : impossible de refaire la pomme à partir de la compote.
   const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
   return await bcrypt.hash(password, rounds);
   // return await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));
};


//Comparer un mot de passe (haché et non haché)
const comparedPassword = async (password, hash) => {
    // Bcrypt reprend le mot de passe clair, le remet en compote de la même façon,
    // et regarde si ça donne la même compote que celle stockée en base.
    return await bcrypt.compare(password, hash);
};



module.exports = {findClientByEmail, createClient, hashPassword, comparedPassword};
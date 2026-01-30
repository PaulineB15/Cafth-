// Contrôleur client
const {createClient, findClientByEmail, hashPassword, comparedPassword} = require("../models/ClientModel");
const jwt = require("jsonwebtoken"); // npm instal jsonwebtoken


// Inscription du client
const register = async (req, res) => {
    try {
      const { nom, prenom, email, mot_de_passe} = req.body;


      // Vérifier si l'email existe déja
        const existingClient = await findClientByEmail(email);

        if (existingClient.length > 0) {
           return res.status(400).json({
               message: "Cet email est déja utilisé"
           });
        }

        // Hacher le mot de passe
        const hash = await hashPassword(mot_de_passe);

        // Créer le client
        const result = await createClient( {
          nom,
            prenom,
            email,
            mot_de_passe: hash,
        });

        res.status(201).json({
            message: "Inscription réussie",
            client_id: result.insertId,
            client: {nom, prenom, email},
        });

        } catch (error){
            console.error("Erreur inscription", error.message);
            res.status(500).json({
                message: "Erreur lors de l'inscription",
            });
        }
};


// Connexion
const login = async (req, res) => {
    try {
      const {email, mot_de_passe} = req.body;

      // Rechercher le client
        const listeClients = await findClientByEmail(email);

        if (listeClients.length === 0) {
           return res.status(401).json({
             message: "Identifiant incorrects"
           });
        }

        const client = listeClients[0];

        // Vérifier le mot de passe
        const isMatch = await comparedPassword(mot_de_passe, client.MDP_CLIENT);

        if (!isMatch) {
            return res.status(401).json({
                message: "Identifiant incorrects"
            });
        }

        // Générer le token JWT
        const token = jwt.sign({
                id: client.ID_CLIENT,
            email: client.EMAIL_CLIENT,
            },
            process.env.JWT_SECRET,
            //{expiresIn: process.env.JWT_EXPIRE_IN || "1h"},
        );

        res.json({
            message: "Connexion réussie",
            token,
            client: {
                id: client.ID_CLIENT,
                nom: client.NOM_CLIENT,
                prenom: client.PRENOM_CLIENT,
                email: client.EMAIL_CLIENT,
            },

        });


} catch (error){
    console.error("Erreur de connexion utilisateur", error.message);
    res.status(500).json({
        message: "Erreur lors de l'inscription",
    });
}

};
module.exports = {register, login};
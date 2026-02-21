// Contrôleur client

// On importe les fonctions qui parlent à la base de données (le Model)
const {createClient, findClientByEmail, hashPassword, comparedPassword, findClientById} = require("../models/ClientModel");
// On importe l'outil pour créer le "badge VIP" (le token)
const jwt = require("jsonwebtoken"); // npm instal jsonwebtoken


// FONCTION INSCRIPTION D'UN CLIENT
const register = async (req, res) => {
    try {
        // 1. On récupère ce que l'utilisateur a tapé dans le formulaire (ou Postman)
        // "req.body" contient le JSON envoyé
      const { nom, prenom, email, mot_de_passe } = req.body;


      // 1.1 SECURITE DE LA LONGUEUR DU MOT DE PASSE (12 caractères minimum)
      if (mot_de_passe.length < 12) {
        return res.status(400).json({
            message: "Le mot de passe doit contenir au moins 12 caractères"
        });
      }

      // 2. Sécurité: Vérifier si l'email existe déja
        const existingClient = await findClientByEmail(email);

        // Si la liste renvoyée n'est pas vide, c'est que l'email est pris !
        if (existingClient.length > 0) {
            // On arrête tout (return) et on renvoie une erreur 400 (Bad Request)
           return res.status(400).json({
               message: "Cet email est déja utilisé"
           });
        }

        // 3. Sécurité du mot de passe
        // On ne stocke JAMAIS un mot de passe en clair. On le "hache" (on le transforme en purée illisible)
        // Hacher le mot de passe
        const hash = await hashPassword(mot_de_passe);

        // 4. On demande au Model d'inscrire le client dans la base de données
        // Note : on envoie 'hash' et non le vrai mot de passe
        // Créer le client
        const result = await createClient( {
          nom,
            prenom,
            email,
            tel, // Ajout du tel pour la création du compte
            mot_de_passe: hash,
        });

        // 5. Tout s'est bien passé ! On renvoie le code 201 (Créé avec succès)
        res.status(201).json({
            message: "Inscription réussie",
            client_id: result.insertId, // L'ID que la base de données a donné
            client: {nom, prenom, email},
        });

        } catch (error){
        // Si le serveur plante (bug de code ou base de données éteinte)
            console.error("Erreur inscription", error.message);
            res.status(500).json({
                message: "Erreur lors de l'inscription",
            });
        }
};


// FONCTION DE CONNEXION
// Connexion
const login = async (req, res) => {
    try {
        // 1. On récupère email et mot de passe envoyés par l'utilisateur
      const {email, mot_de_passe} = req.body;

        // 2. On cherche si un client avec cet email existe
        const listeClients = await findClientByEmail(email);

        // Si la liste est vide = l'email n'existe pas
        if (listeClients.length === 0) {
           return res.status(401).json({
             message: "Identifiant incorrects"
           });
        }

        // On récupère le premier (et unique) client trouvé
        const client = listeClients[0];

        // 3. Le moment de vérité : On compare le mot de passe tapé avec celui crypté en BDD
        // 'isMatch' sera VRAI ou FAUX
        // Vérifier le mot de passe
        const isMatch = await comparedPassword(mot_de_passe, client.MDP_CLIENT);

        if (!isMatch) {
            return res.status(401).json({
                message: "Identifiant incorrects"
            });
        }

        // 4. Création du Pass VIP (Le Token JWT)
        // C'est un badge numérique signé que le client gardera pour prouver qu'il est connecté
        // Générer le token JWT
        // Expire en secondes
        const expire = parseInt(process.env.JWT_EXPIRE_IN, 10) || 3600;
        const token = jwt.sign({
                id: client.ID_CLIENT, // On cache l'ID dans le badge
            email: client.EMAIL_CLIENT, // On cache l'email dans le badge'
            },
            process.env.JWT_SECRET,
            { expiresIn: expire }
            // Signer avec notre clé secrète (dans le fichier .env)
            //{expiresIn: process.env.JWT_EXPIRE_IN || "1h"},
        );

        // On place le token dans un cookie HTTP only
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Mettre sur true en HTTPS lors du déploiement
            sameSite: "lax",
            maxAge: expire * 1000,
        });


        // 5. On renvoie le badge au client
        res.json({
            message: "Connexion réussie",
            token, // Le client doit stocker ça pour ses futurs achats !
            client: {
                id: client.ID_CLIENT,
                nom: client.NOM_CLIENT,
                prenom: client.PRENOM_CLIENT,
                email: client.EMAIL_CLIENT,
                // Ces données sont un rappel necessaire lors du tunnel achat
                tel: client.TEL_CLIENT,
                adresse_livraison: client.ADRESSE_LIVRAISON,
                cp_livraison: client.CP_LIVRAISON,
                ville_livraison: client.VILLE_LIVRAISON
            },
        });



} catch (error){
    console.error("Erreur de connexion utilisateur", error.message);
    res.status(500).json({
        message: "Erreur lors de l'inscription",
    });
}
};

// Fonction de déconnexion
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // Mettre sur true en HTTPS lors du déploiement
        sameSite: "lax"
    });
    res.json({ message: "Déconnexion réussie" });
};

// Automatiquement, le navigateur envoie le cookie
// le middleware vérifie que le cookie est valide / JWT valide
// Si le token est valide, on retourne les infos du client
const getMe = async (req, res) => {
    try {
        // req.client.id vient du JWT decode par le middleware verifyToken
        const clients = await findClientById(req.client.id);

        if (clients.length === 0) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        const client = clients[0];

        res.json({
            client: {
                id: client.ID_CLIENT,
                nom: client.NOM_CLIENT,
                prenom: client.PRENOM_CLIENT,
                email: client.EMAIL_CLIENT,
                tel: client.TEL_CLIENT,
                adresse_livraison: client.ADRESSE_LIVRAISON,
                cp_livraison: client.CP_LIVRAISON,
                ville_livraison: client.VILLE_LIVRAISON
            }
        });
    } catch (error) {
        console.error("Erreur /me:", error.message);
        res.status(500).json({ message: "Erreur lors de la vérification de session" });
    }
};

module.exports = {register, login, logout, getMe};
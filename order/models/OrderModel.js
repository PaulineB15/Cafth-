// Model order

const db = require("../../db");

// CREER UNE COMMANDE
const createOrder = async (orderData) => {
    const {id_client, montant_total, produits} = orderData;

    // Insertion dans la table "commande"
    const [orderResult] = await db.query("INSERT INTO commande (DATE_COMMANDE, STATUT_COMMANDE, MODE_COMMANDE, MONTANT_TOTAL, ID_CLIENT) VALUES (NOW(), 'En attente', 'Web', ?, ?)", [ montant_total, id_client]);

    // TRAITEMENT DES PRODUITS (INSERTION + MISE A JOUR STOCK)
    const orderId = orderResult.insertId;
    //Insertion des produits dans la table de liaison "contenir"
    // On parcourt le tableau des produits envoyés
    for (const item of produits) {
        await db.query(
         "INSERT INTO contenir (ID_PRODUIT, ID_COMMANDE, QUANTITE_COMMANDEE) VALUES (?, ?, ?)", [item.id_produit, orderId, item.quantite]);

        // Mise à jour du stock du produit
        // Soustrait la quantité commandée au stock actuel du produit
        await db.query(
            "UPDATE produit SET STOCK = STOCK - ? WHERE ID_PRODUIT = ?", [item.quantite, item.id_produit] // Requête SQL
        );
    }

    return orderId;
}


// FONCTION POUR RECUPERER L'HISTORIQUE DES COMMANDES D'UN CLIENT
// Elle doit être en dehors de la 1ere fonction "Créer une commande"
const getOrderByIdClient = async (id_client) => {
    // Selection des commandes avec le calcul du nombre total d'articles (SUM)
    // On fait une jointure (LEFT JOIN) avec la table 'contenir' pour lire les quantités
    // Trie par date décroissante (DESC) pour voir la plus récente en premier
    const [rows] = await db.query(
        `SELECT c.*, SUM(ct.QUANTITE_COMMANDEE) AS total_articles 
         FROM commande c 
         LEFT JOIN contenir ct ON c.ID_COMMANDE = ct.ID_COMMANDE 
         WHERE c.ID_CLIENT = ? 
         GROUP BY c.ID_COMMANDE 
         ORDER BY c.DATE_COMMANDE DESC`,
        [id_client]
    );
    return rows;
};

module.exports = {createOrder, getOrderByIdClient};

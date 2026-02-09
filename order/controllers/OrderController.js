const {createOrder, getOrderByIdClient} = require('../models/OrderModel');
const db = require("../../db");


// FONCTION POUR FAIRE UNE COMMANDE
const placeOrder = async (req, res) => {
    try {
        const {montant_total, produits} = req.body;
        const id_client = req.client.id;

        if (!id_client) {
            return res.status(401).json({error: "Utilisateur non authentifié"});
        }

        const orderId = await createOrder({id_client, montant_total, produits});

        res.status(201).json({
            message: "Commande enregistrée !",
            orderId: orderId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erreur lors de la création de la commande"});
    }
};


//FONCTION POUR VOIR L'HISTORIQUE DES COMMANDES D'UN CLIENT
const getMyOrders = async (req, res) => {
    try {
        // Récupérer l'ID du client connecté via le token JWT
        const idClient = req.client.id;

        const orders = await getOrderByIdClient(idClient);

        res.json({
            message: "Historique des commandes récupéré avec succès",
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erreur lors de la récupération des commandes"});
    }

}

module.exports = {placeOrder, getMyOrders};
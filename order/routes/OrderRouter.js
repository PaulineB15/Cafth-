// Router Orders

const express = require('express');
const router = express.Router();
const {placeOrder, getMyOrders} = require("../controllers/OrderController");
const {verifyToken} = require("../../middleware/authMiddleware");

// Route pour créer une commande (POST)
// URL : http://localhost:3000/api/orders/ dans Postman
router.post('/', verifyToken, placeOrder, getMyOrders);

//Route pour voir l'historique des commandes (GET)
// URL : http://localhost:3000/api/orders/me
router.get('/me', verifyToken, getMyOrders);
module.exports = router;
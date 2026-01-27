// Router Produits
// Chemin : /api/produits

const express = require("express");
const {getAll, getById} = require("../controllers/ProduitController");
const router = express.Router();

// GET /api/produits - Récupérer tous les produits
router.get("/", getAll);

// GET /api/produits/:id - Récuperer un produit par son id
router.get("/:id", getById);

module.exports = router;

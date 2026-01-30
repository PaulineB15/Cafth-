// Router Produits
// Chemin : /api/produits

const express = require("express");
const {getAll, getById, getByCategory} = require("../controllers/ProduitController");
const {verifyToken} = require("../../middleware/authMiddleware");
const router = express.Router();

// GET /api/produits - Récupérer tous les produits
router.get("/", verifyToken, getAll);

// GET /api/produits/:id - Récuperer un produit par son id
router.get("/:id", getById);

// GET /api/produits/categorie:categorie - Récupérer les produits d'une catégorie
router.get("/categorie/:categorie", getByCategory);

module.exports = router;

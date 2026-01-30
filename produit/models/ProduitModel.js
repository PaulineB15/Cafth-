// Model Produit

const db = require("../../db");

// Récupérer tous les produits
const getAllProduits = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM produit");
    return rows;
};


// Récupérer un produit par son ID
const getProduitById = async (id) => {
    const [rows] = await db.query("SELECT * FROM produit WHERE ID_PRODUIT = ?", [id]);
    return rows;
};


// Récupérer un produit par sa catégorie
const getProduitByCategory = async (categorie) => {
    const [rows] = await db.query("SELECT * FROM produit WHERE CATEGORIE = ?", [categorie]); // ici [categorie] est une variable
    return rows;
};


module.exports = {getAllProduits, getProduitById, getProduitByCategory};

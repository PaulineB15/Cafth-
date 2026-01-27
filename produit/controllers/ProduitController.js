// Controller Produits
const {getAllProduits, getProduitById} = require("../models/ProduitModel");

// Récupérer tous les produits

const getAll = async (req, res) => {
    try {
      const produit = await getAllProduits();

      res.json({
          message: "Articles récupérés avec succés",
          count: produit.length,
          produit,
      });

    } catch (error) {
        console.error("Erreur de récupération des produits", error.message);
        res.status(500).json({
         message: "Erreur de récupération des articles",
        });
    }
};

// Récupérer un article par son ID
const getById = async (req, res) => {
    try {
      //const id = req.params.id;
        const { id } = req.params; // Destructuré
        const produitId = parseInt(id);

        const produit = await getProduitById(produitId);

        if ( produit.length === 0) {
            return res.status(404).json({
            message: "Article non trouvé"
            });
        }

        res.json({
            message: "Produit récupéré avec succés",
            produit:produit[0]
            });

    } catch (error) {
        console.error("Erreur de récupération du produit", error.message);
        res.status(500).json({
            message: "Erreur de récupération du produit",
        });

    }
};



module.exports = {getAll, getById};

// Controller Produits
const {getAllProduits, getProduitById, getProduitByCategory} = require("../models/ProduitModel");

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


// Récupérer un produit par son ID
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


// Récupérer un produit par sa catégorie
const getByCategory = async (req, res) => {
    try {
        // Récupérer la catégorie depuis l'URL (req.params)
        const { categorie } = req.params;
        // Appeler le modèle avec cette catégorie
        const produits = await getProduitByCategory(categorie);

        res.json({
            message:`Articles de la categorie ${categorie}`,
            count: produits.length,
            produits,
        });


    } catch(error) {
        console.error("Erreur de récupération par catégorie", error.message);
        res.status(500).json({
            message: "Erreur de récupération des produits",
        });
    }
};


module.exports = {getAll, getById, getByCategory};

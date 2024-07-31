const express = require('express');
const favoriteController = require('../controllers/FavoritesController'); // Adjust the path as necessary

const router = express.Router();

// Create a new favorite
router.post('/', favoriteController.createFavorite);

// Get all favorites for a user
router.get('/user/:userId', favoriteController.getFavoritesByUser);

// Get a specific favorite by ID
router.get('/:id', favoriteController.getFavoriteById);

// Update a favorite
router.put('/:id', favoriteController.updateFavorite);

// Delete a favorite
router.delete('/:id', favoriteController.deleteFavorite);

module.exports = router;
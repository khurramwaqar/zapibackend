const router = require('express').Router();
const GenreController = require('../controllers/GenreController');

router.get('/', GenreController.getAllGenres);
router.get('/:genreId', GenreController.getSpecificGenre);
router.post('/', GenreController.createGenre);
router.put('/:genreId', GenreController.updateGenre);
router.delete('/:genreId', GenreController.deleteGenre);

module.exports = router;
const router = require('express').Router();
const CategoryController = require('../controllers/CategoriesController');

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getSpecificCategory);
router.post('/', CategoryController.createCategory);
router.put('/:categoryId', CategoryController.updateCategory);
router.delete('/:categoryId', CategoryController.deleteCategory);
router.get('/bkend', CategoryController.getAllCategoriesForBackend)
module.exports = router;
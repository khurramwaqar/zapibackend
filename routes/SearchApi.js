const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchApiController');

router.get('/:searchId', searchController.doSearch);

module.exports = router;
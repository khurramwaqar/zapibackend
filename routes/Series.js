const router = require('express').Router();
const SeriesController = require('../controllers/SeriesController');

router.get('/', SeriesController.getAllSeries);
router.get('/sergen', SeriesController.getAllSeriesWithGenres);
router.get('/:seriesId', SeriesController.getSpecificSeries);
router.get('/byCatID/:catId', SeriesController.getAllSeriesByCategoriesId);
router.get('/byCatID/:catId/:cn', SeriesController.getAllSeriesByCategoriesId);

router.get('/byCatIDInt/:catId', SeriesController.getAllSeriesByCategoriesIdInt);

router.get('/getCount/:catId', SeriesController.getSeriesCountByCatId)

router.post('/', SeriesController.createSeries);
router.put('/:seriesId', SeriesController.updateSeries);
router.put('/status/:seriesId', SeriesController.updateAsDraft);
router.delete('/:seriesId', SeriesController.deleteSeries);
router.put('/positions/:seriesIds', SeriesController.updateSeriesPositions);

module.exports = router;
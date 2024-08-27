const Series = require('../models/Series');
const YTEpisode = require('../models/YTEpisode');

// Search in Series and YTEpisode
const doSearch = async (req, res) => {
    const query = req.params.searchId;

    try {
        // Search in Series
        const seriesResults = await Series.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { cast: { $regex: query, $options: 'i' } }  // Searching within cast array

            ]
        });

        const castResults = seriesResults.flatMap(series => series.cast);


        // Search in YTEpisode
        const episodeResults = await YTEpisode.find({
            $or: [
                { 'title': { $regex: query, $options: 'i' } }
                // { 'snippet.description': { $regex: query, $options: 'i' } },
            ]
        });

        res.status(200).json({
            series: seriesResults,
            episodes: episodeResults,
            cast: castResults  // Adding cast results to the response
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching.' });
    }
};
const doSearchbyCast = async (req, res) => {
    const query = req.params.castId;

    try {
        // Search in Series
        const seriesResults = await Series.find({
            $or: [
                { cast: { $regex: query, $options: 'i' } }  // Searching within cast array

            ]
        });

        res.status(200).json({
            series: seriesResults
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching.' });
    }
};
module.exports = {
    doSearch,
    doSearchbyCast
};
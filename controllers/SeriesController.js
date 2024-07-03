const axios = require('axios');
const Series = require('../models/Series');
const mongoose = require('mongoose');
const redisClient = require('../redis-server')
//Get All Series



const getAllSeries = async (req, res) => {
    try {

        const code = await axios.get('https://1.1.1.1/cdn-cgi/trace');
        const newArray = code.data.match(/loc=(\S+)/)[1];
        const data = newArray;
        // const series = await Series.find({ status: "published" }).populate({
        //     path: 'geoPolicy',
        //     match: { 'condition': 'Available' },
        //     select: 'condition'
        // });
        const series = await Series.aggregate([
            {
                $lookup: {
                    from: 'geopolicies', // Assuming the name of the geoPolicy collection is 'geopolicies'
                    localField: 'geoPolicy',
                    foreignField: '_id',
                    as: 'geoPolicyInfo'
                }
            },
            {
                $match: {
                    'geoPolicyInfo.countries': "PK"
                }
            },
            {
                $sort: {
                    position: -1
                }
            }
        ]);
        //db.events.find({"details.detail_list.count": {"$gt": 0}})

        res.json({ pid: process.pid, series: series, countryCode: data });
    } catch (err) {
        res.json({ message: err });
    }
};

const getSeriesCountByCatId = async (req, res) => {

    const catId = new mongoose.Types.ObjectId(req.params.catId);

    try {

        const count = await Series.aggregate([
            {
                $lookup: {
                    from: 'categories', // Assuming the name of the geoPolicy collection is 'geopolicies'
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $match: {
                    'categoryInfo._id': catId
                }
            },
            {
                $count: "seriesCount" // This will create a field called seriesCount with the count result
            },
            {
                $sort: {
                    position: -1
                }
            }
        ]);

        res.json({ count: count[0].seriesCount, catId: catId });
    } catch (err) {

        res.json({ count: 0, catId: catId });
    }
};

const getAllSeriesByCategoriesId = async (req, res) => {
    try {

        if (req.params.cn) {

            //fetch data from redis if available otherwise set a new data into redis

            const data = req.params.cn;





            // const series = await Series.find({ status: "published" }).populate({
            //     path: 'geoPolicy',
            //     match: { 'condition': 'Available' },
            //     select: 'condition'
            // });
            const series = await Series.aggregate([
                {
                    $lookup: {
                        from: 'categories', // Assuming the name of the geoPolicy collection is 'geopolicies'
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'categoryIdInfo'
                    }
                },
                {
                    $match: {
                        'categoryIdInfo.title': req.params.catId
                    }
                }, {
                    $lookup: {
                        from: 'geopolicies', // Assuming the name of the geoPolicy collection is 'geopolicies'
                        localField: 'geoPolicy',
                        foreignField: '_id',
                        as: 'geoPolicyInfo'
                    },
                },
                {
                    $match: {
                        'geoPolicyInfo.countries': data
                    }
                },
                {
                    $sort: {
                        position: -1
                    }
                }
            ]);
            //db.events.find({"details.detail_list.count": {"$gt": 0}})

            res.json({ series: series, countryCode: data });





        } else {

            const data = ["PK"];
            // const series = await Series.find({ status: "published" }).populate({
            //     path: 'geoPolicy',
            //     match: { 'condition': 'Available' },
            //     select: 'condition'
            // });
            const series = await Series.aggregate([
                {
                    $lookup: {
                        from: 'categories', // Assuming the name of the geoPolicy collection is 'geopolicies'
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'categoryIdInfo'
                    }
                },
                {
                    $match: {
                        'categoryIdInfo.title': req.params.catId
                    }
                }, {
                    $lookup: {
                        from: 'geopolicies', // Assuming the name of the geoPolicy collection is 'geopolicies'
                        localField: 'geoPolicy',
                        foreignField: '_id',
                        as: 'geoPolicyInfo'
                    },
                },
                {
                    $match: {
                        'geoPolicyInfo.countries': data
                    }
                },
                {
                    $sort: {
                        position: 1
                    }
                }
            ]);
            //db.events.find({"details.detail_list.count": {"$gt": 0}})

            res.json({ series: series, countryCode: req.params.cn });
        }




    } catch (err) {
        res.json({ message: err });
    }
};

const getAllSeriesByCategoriesIdInt = async (req, res) => {
    try {

        const code = await axios.get('https://1.1.1.1/cdn-cgi/trace');
        const newArray = code.data.match(/loc=(\S+)/)[1];
        const data = ["PK"];
        // const series = await Series.find({ status: "published" }).populate({
        //     path: 'geoPolicy',
        //     match: { 'condition': 'Available' },
        //     select: 'condition'
        // });
        const series = await Series.aggregate([
            {
                $lookup: {
                    from: 'categories', // Assuming the name of the geoPolicy collection is 'geopolicies'
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryIdInfo'
                }
            },
            {
                $match: {
                    'categoryIdInfo.categoryId': [req.params.catId]
                }
            },
            {
                $lookup: {
                    from: 'geopolicies', // Assuming the name of the geoPolicy collection is 'geopolicies'
                    localField: 'geoPolicy',
                    foreignField: '_id',
                    as: 'geoPolicyInfo'
                },
            },
            {
                $match: {
                    'geoPolicyInfo.countries': data
                }
            }
        ]);
        //db.events.find({"details.detail_list.count": {"$gt": 0}})

        res.json({ series: series, countryCode: data });
    } catch (err) {
        res.json({ message: err });
    }
};

//Get a specific series

const getSpecificSeries = async (req, res) => {
    try {
        const series = await Series.findById(req.params.seriesId).populate("appId").populate("genreId").populate("categoryId").populate("ageRatingId").populate("geoPolicy");
        res.json(series);
    } catch (err) {
        res.json({ message: err });
    }
};

//Create a new series

const createSeries = async (req, res) => {

    const series = new Series({
        title: req.body.title,
        description: req.body.description,
        cast: req.body.cast,
        seriesDM: req.body.seriesDM,
        seriesYT: req.body.seriesYT,
        seiresCDN: req.body.seiresCDN,
        imagePoster: req.body.imagePoster,
        imageCoverMobile: req.body.imageCoverMobile,
        imageCoverDesktop: req.body.imageCoverDesktop,
        trailer: req.body.trailer,
        ost: req.body.ost,
        logo: req.body.logo,
        day: req.body.day,
        time: req.body.time,
        categoryId: req.body.categoryId,
        genreId: req.body.genreId,
        ageRatingId: req.body.ageRatingId,
        appId: req.body.appId,
        status: "published",
        geoPolicy: req.body.geoPolicy,
        adsManager: req.body.adsManager,
        seriesType: req.body.seriesType,
        publishedAt: Date.now() + (5 * 60 * 60 * 1000)
    });

    try {
        const savedSeries = await series.save();
        res.json(savedSeries);
    } catch (err) {
        res.json({ message: err });
    }
};

//Update a series

const updateSeries = async (req, res) => {

    try {

        const updatedSeries = await Series.updateOne(
            { _id: req.params.seriesId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    seriesDM: req.body.seriesDM,
                    seriesYT: req.body.seriesYT,
                    seiresCDN: req.body.seiresCDN,
                    imagePoster: req.body.imagePoster,
                    imageCoverMobile: req.body.imageCoverMobile,
                    imageCoverDesktop: req.body.imageCoverDesktop,
                    trailer: req.body.trailer,
                    ost: req.body.ost,
                    logo: req.body.logo,
                    day: req.body.day,
                    time: req.body.time,
                    categoryId: req.body.categoryId,
                    genreId: req.body.genreId,
                    ageRatingId: req.body.ageRatingId,
                    appId: req.body.appId,
                    status: "published",
                    geoPolicy: req.body.geoPolicy,
                    adsManager: req.body.adsManager,
                    seriesType: req.body.seriesType
                },
            }
        );

        res.json(updatedSeries);
    } catch (err) {
        res.json({ message: err });
    }
};

//Delete a series

const deleteSeries = async (req, res) => {
    try {
        const removedSeries = await Series.remove({ _id: req.params.seriesId });
        res.json(removedSeries);
    } catch (err) {
        res.json({ message: err });
    }
};

// Update series published status to draft status


const updateAsDraft = async (req, res) => {

    try {
        const updateAsDrafts = await Series.updateOne(
            { _id: req.params.seriesId },
            {
                $set: {
                    status: req.body.status,
                },
            }
        );
        res.json(updateAsDrafts);
    } catch (err) {
        res.json({ message: err });
    }

};
const updateSeriesPositions = async (req, res) => {
    const seriesUpdates = req.body.series; // Expecting an array of { _id, position } objects

    if (!Array.isArray(seriesUpdates)) {
        return res.status(400).json({ message: "Invalid input data. Expected an array of series updates." });
    }

    const bulkOps = seriesUpdates.map(item => ({
        updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(item._id) },
            update: { $set: { position: item.position } }
        }
    }));

    try {
        const result = await Series.bulkWrite(bulkOps);
        res.json({ message: "Positions updated successfully", result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllSeries,
    getSpecificSeries,
    createSeries,
    updateSeries,
    deleteSeries,
    updateAsDraft,
    getAllSeriesByCategoriesId,
    getAllSeriesByCategoriesIdInt,
    getSeriesCountByCatId,
    updateSeriesPositions
};
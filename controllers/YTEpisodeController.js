const { response } = require('express');
const YTEpisodeSchema = require('../models/YTEpisode');
const axios = require('axios');

function getPosts() {
    const response = fetch('https://node.aryzap.com/api/series');
    return response.json();
}

const getLoc = async (req, res) => {

    try {
        const resp = await axios.get(`https://1.1.1.1/cdn-cgi/trace`);
        const data = resp.data;
        const newArray = resp.data.match(/loc=(\S+)/)[1];



        res.json({ country: newArray });

    } catch (e) {
        res.json({ error: e.message });
    }

};

const ytEPF = async (req, res) => {

    const newData = [];
    const episodeData = [];

    try {
        const resp = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=status,snippet,id,contentDetails&playlistId=${req.params.playlistId}&key=AIzaSyAC0SFYQGHzybGsYo8Ll1tG5GPrHZvl4zc&maxResults=100`);
        const data = resp.data.items;

        // TODO: Create a For loop that will check if item etag is already exists or not if its not exists then it will create a new item

        for (const item of data) {

            const existingItem = await YTEpisodeSchema.findOne({ videoYtId: item.contentDetails.videoId });

            if (!existingItem) {
                //Insert a new Item
                const newItem = new YTEpisodeSchema({ seriesId: req.params.seriesId, videoSource: null, title: item.snippet.title, description: item.snippet.description, imagePath: item?.snippet?.thumbnails?.medium?.url, videoYtId: item.contentDetails.videoId, videoViews: null, videoLength: null });
                const savedEpisode = await newItem.save();
                console.log(`Inserted item with _id ${savedEpisode._id}`);
                newData.push(savedEpisode);
            } else {
                console.log(`Item with _id ${item.id} already exists in the database.`);
            }


        }

        res.json(newData);

    } catch (e) {
        res.json({ error: e.message });
    }

};

const getAllYTEpisodes = async (req, res) => {
    try {
        const episode = await YTEpisodeSchema.find();
        res.json({ episode: episode });
    } catch (err) {
        res.json({ message: err });
    }
};

//Get a specific episode

const getSpecificYTEpisode = async (req, res) => {

    try {
        const episode = await YTEpisodeSchema.findOne(req.params.episodeId);
        res.json({ episode: episode });
    } catch (err) {
        res.json({ message: err });
    }
};

const getSpecificYTEpisodesBySeriesID = async (req, res) => {

    try {
        const episode = await YTEpisodeSchema.find({ seriesId: req.params.seriesId });
        res.json({ episode: episode });
    } catch (err) {
        res.json({ message: err });
    }
};

//Create a new episode

const createYTEpisode = async (req, res) => {

    const episode = new YTEpisodeSchema({
        title: req.body.title,
        description: req.body.description,
        season: req.body.season,
        episode: req.body.episode,
        air_date: req.body.air_date,
        cast: req.body.cast,
        series: req.body.series,
        image: req.body.image,
        imageCover: req.body.imageCover,
        imagePortrait: req.body.imagePortrait,
        trailer: req.body.trailer,
        video: req.body.video,
    });

    try {
        const savedEpisode = await episode.save();
        res.json(savedEpisode);
    } catch (err) {
        res.json({ message: err });
    }
};

//Update an episode

const updateYTEpisode = async (req, res) => {

    try {

        const updatedEpisode = await YTEpisodeSchema.updateOne(
            { _id: req.params.episodeId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    season: req.body.season,
                    episode: req.body.episode,
                    air_date: req.body.air_date,
                    cast: req.body.cast,
                    series: req.body.series,
                    image: req.body.image,
                    imageCover: req.body.imageCover,
                    imagePortrait: req.body.imagePortrait,
                    trailer: req.body.trailer,
                    video: req.body.video,
                },
            }
        );
        res.json(updatedEpisode);
    } catch (err) {
        res.json({ message: err });
    }
};

//Delete an episode

const deleteYTEpisode = async (req, res) => {
    try {
        const removedEpisode = await YTEpisodeSchema.deleteOne({ _id: req.params.episodeId });
        res.json(removedEpisode);
    } catch (err) {
        res.json({ message: err });
    }
};

module.exports = {
    getAllYTEpisodes,
    getSpecificYTEpisode,
    createYTEpisode,
    updateYTEpisode,
    deleteYTEpisode,
    getSpecificYTEpisodesBySeriesID,
    ytEPF,
    getLoc
};
const mongoose = require('mongoose');

const DMEpisodeSchema = new mongoose.Schema({
    seriesId: {
        type: String,
        trim: true
    },
    videoSource: {
        type: String,
        required: false,
    },
    thumbnail_180_url: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    views_total: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    ownerName: {
        type: String,
        required: false
    },
    owenerId: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('DMEpisode', DMEpisodeSchema);
const mongoose = require('mongoose');

const YTEpisodeSchema = new mongoose.Schema({
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Series'
    },
    videoSource: {
        type: String,
        required: false,
        trim: true
    },
    kind: {
        type: String,
        required: false,
        trim: true
    },
    etag: {
        type: String,
        required: false,
        trim: true,
        unique: true
    },
    id: {
        type: String,
        required: false,
        trim: true
    },
    snippet: {
        type: Object,
        required: false,
        trim: true
    },
    contentDetails: {
        type: Object,
        required: false,
        trim: true
    },
    status: {
        type: Object,
        required: false,
        trim: true
    }

});

module.exports = mongoose.model('YTEpisode', YTEpisodeSchema);
const mongoose = require('mongoose');

const GenresSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Apps'
    }
});

module.exports = mongoose.model('Genres', GenresSchema);
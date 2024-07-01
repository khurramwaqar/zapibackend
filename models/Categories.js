const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Series'
    }
});

module.exports = mongoose.model('Categories', CategoriesSchema);
const mongoose = require('mongoose');

const AppsSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    bundleId: String,
    platform: String
});

module.exports = mongoose.model('Apps', AppsSchema);

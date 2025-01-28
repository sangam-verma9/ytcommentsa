const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoId: String,
    title: String,
    link: String,
    fetchedAt: Date,
});

module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema);

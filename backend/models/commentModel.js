const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    videoId: String,
    commenterNameMasked: String,
    sentiment: String,
    text: String,
    postedAt: Date,
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

const express = require('express');
const axios = require('axios');
const Sentiment = require('sentiment');
const connectdb = require('./database/db');
const Video = require("./models/videoModel")
const Comment = require("./models/commentModel")
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(express.json());
dotenv.config({ path: "./config/config.env" })
connectdb();
app.use(cors());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.post('/analyze', async (req, res) => {
    try {
        const videoLink = req.body.link;
        const videoId = new URL(videoLink).searchParams.get('v');

        // Fetch video details and comments
        const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: { id: videoId, key: YOUTUBE_API_KEY, part: 'snippet' },
        });
        const commentsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
            params: { videoId, key: YOUTUBE_API_KEY, part: 'snippet', maxResults: 500 },
        });

        // Process and analyze comments
        const sentimentAnalyzer = new Sentiment();
        const comments = commentsResponse.data.items.map((item) => {
            const commentText = item.snippet.topLevelComment.snippet.textOriginal;
            const sentiment = sentimentAnalyzer.analyze(commentText);
            return {
                text: commentText,
                sentiment: sentiment.score > 0 ? 'Agree' : sentiment.score < 0 ? 'Disagree' : 'Neutral',
                commenterNameMasked: `User${Math.random().toString(36).substring(7)}`,
                postedAt: new Date(item.snippet.topLevelComment.snippet.publishedAt),
            };
        });

        // Save to MongoDB
        await Video.create({ videoId, title: videoResponse.data.items[0].snippet.title, link: videoLink, fetchedAt: new Date() });
        await Comment.insertMany(comments.map((c) => ({ videoId, ...c })));

        res.json({ message: 'Analysis complete', comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000...'));

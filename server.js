const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/dino-game', { useNewUrlParser: true, useUnifiedTopology: true });

const scoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/submit', async (req, res) => {
    const { username, score } = req.body;
    const newScore = new Score({ username, score });
    await newScore.save();
    res.sendStatus(200);
});

app.get('/leaderboard', async (req, res) => {
    const topScores = await Score.find().sort({ score: -1 }).limit(5);
    res.json({ topScores });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

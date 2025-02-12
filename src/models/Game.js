const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    difficulty: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: Number, required: true },
    score: { type: Number, default: 0 },
    history: [
        {
            question: String,
            givenAnswer: Number,
            correct: Boolean,
            timeTaken: Number,
        },
    ],
    timeStarted: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Game", GameSchema);

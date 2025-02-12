const Game = require("../models/Game");
const generateEquation = require("../utils/equationGenerator");

// Start a new game
exports.startGame = async (req, res) => {
    console.log(req.body);
    const { name, difficulty } = req.body;

    if (!name || difficulty < 1 || difficulty > 4) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const { question, answer } = generateEquation(difficulty);

    const game = await Game.create({ name, difficulty, question, answer });

    res.json({
        message: `Hello ${name}, find your submit API URL below`,
        submit_url: `/game/${game._id}/submit`,
        question,
        time_started: game.timeStarted,
    });
};

// Submit answer
exports.submitAnswer = async (req, res) => {
    const { game_id } = req.params;
    const { answer } = req.body;

    const game = await Game.findById(game_id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const timeTaken = (Date.now() - game.timeStarted) / 1000;
    const correct = answer === game.answer;

    game.history.push({
        question: game.question,
        givenAnswer: answer,
        correct,
        timeTaken,
    });

    if (correct) game.score += 1;
    
    await game.save();

    res.json({
        result: correct
            ? `Good job ${game.name}, your answer is correct!`
            : `Sorry ${game.name}, your answer is incorrect.`,
        time_taken: timeTaken,
        current_score: game.score / game.history.length,
        history: game.history,
    });
};

// Get game status
exports.getGameStatus = async (req, res) => {
    const { game_id } = req.params;
    const game = await Game.findById(game_id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const total_time_spent = game.history.reduce((acc, h) => acc + h.timeTaken, 0);

    res.json({
        name: game.name,
        difficulty: game.difficulty,
        current_score: game.score / game.history.length,
        total_time_spent,
        history: game.history,
    });
};

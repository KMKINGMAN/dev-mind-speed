const Game = require("../models/Game");
const generateEquation = require("../utils/equationGenerator");

exports.startGame = 
/**
 * @brief Start a new game 
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns 
 */
async (req, res) => {
    const { name, difficulty } = req.body;

    if (!name || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 4) {
        return res.status(400).json({ error: "Invalid input" });
    }

    let question, answer;
    try {
        ({ question, answer } = generateEquation(difficulty));
    } catch (error) {
        return res.status(400).json({ error: "Failed to generate equation" });
    }

    const game = await Game.create({ name, difficulty, question, answer });

    res.json({
        message: `Hello ${name}, find your submit API URL below`,
        submit_url: `/game/${game._id}/submit`,
        question,
        time_started: game.timeStarted,
    });
};

exports.submitAnswer = 
/**
 * @brief Submit answer to the game
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async (req, res) => {
    const { game_id } = req.params;
    const { answer } = req.body;

    if (!answer || typeof answer !== 'number') {
        return res.status(400).json({ error: "Invalid input" });
    }
    let game;
    try {
        game = await Game.findById(game_id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve game" });
    }
    const timeTaken = (Date.now() - game.timeStarted.getTime()) / 1000;
    const correct = answer === game.answer;
    game.history.push({
        question: game.question,
        givenAnswer: answer,
        correct,
        timeTaken,
    });
    if (correct) {
        game.score += 1;
    }
    try {
        await game.save();
    } catch (error) {
        return res.status(500).json({ error: "Failed to save game" });
    }
    const currentScore = game.history.length > 0 ? game.score / game.history.length : 0;
    res.json({
        result: correct ? 
            `Good job ${game.name}, your answer is correct!` : 
            `Sorry ${game.name}, your answer is incorrect.`,
        time_taken: timeTaken,
        current_score: currentScore,
        history: game.history,
    });
};

exports.getGameStatus = 
/**
 * @brief Get the current status of a game
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async (req, res) => {
    const { game_id } = req.params;

    let game;
    try {
        game = await Game.findById(game_id);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve game" });
    }

    const currentScore = game.history.length > 0 ? game.score / game.history.length : 0;
    const totalTimeSpent = game.history.reduce((total, round) => total + round.timeTaken, 0);

    res.json({
        name: game.name,
        difficulty: game.difficulty,
        current_score: currentScore,
        total_time_spent: totalTimeSpent,
        history: game.history
    });
};

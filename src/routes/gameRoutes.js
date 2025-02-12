const express = require("express");
const router = express.Router();
const { startGame, submitAnswer, getGameStatus } = require("../controllers/gameController");

router.post("/game/start", startGame);
router.post("/game/:game_id/submit", submitAnswer);
router.get("/game/:game_id/status", getGameStatus);

module.exports = router;

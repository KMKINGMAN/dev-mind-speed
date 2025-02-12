const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const gameRoutes = require("./routes/gameRoutes");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use("/api", gameRoutes);
module.exports = app;

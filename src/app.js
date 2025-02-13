// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const gameRoutes = require('./routes/gameRoutes');

// Load environment variables
require('dotenv').config();

// Initialize express app
const app = express();

// Configure CORS
const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', gameRoutes);

// Export app
module.exports = app;

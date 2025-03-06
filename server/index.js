/**
 * @file This is the main entry point for the backend server.
 * @module index
 */

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const logger = require('./logger'); // Import the logger

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON data

/**
 * Logging Middleware
 * Logs all incoming requests with method and URL.
 * @function
 */
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/projects', projectRoutes); // Routes for project management
app.use('/api/tasks', taskRoutes); // Routes for task management

/**
 * Error Handling Middleware
 * Logs errors and sends a generic error response to the client.
 * @function
 */
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`); // Log the error
  res.status(500).json({ error: 'Internal Server Error' });
});

// Environment Configuration
const PORT = process.env.PORT || 5000; // Use environment variable for port or default to 5000

// Only start the server if this file is run directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`); // Log server start
  });
}

// Export the app for testing
module.exports = app;
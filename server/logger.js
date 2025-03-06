/**
 * @file This file configures a custom logger using Winston.
 * @module logger
 */

const winston = require('winston');

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Logging level (e.g., 'info', 'error', 'debug')
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    logFormat // Apply custom log format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log to a file
    new winston.transports.File({ filename: 'logs/server.log' }),
  ],
});

// Export the logger
module.exports = logger;
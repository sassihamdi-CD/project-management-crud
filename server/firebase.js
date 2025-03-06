/**
 * @file This file initializes Firebase Firestore for the backend.
 * @module firebase
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Firebase service account credentials
const logger = require('./logger'); // Import the logger

/**
 * Initialize Firebase Admin SDK.
 * @throws {Error} If Firebase initialization fails.
 */
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  logger.info('Firebase Admin SDK initialized successfully'); // Log success
} catch (error) {
  logger.error(`Error initializing Firebase Admin SDK: ${error.message}`); // Log error
  process.exit(1); // Exit the process if initialization fails
}

/**
 * Firestore Database Instance
 * This is the Firestore database instance that will be used throughout the application.
 * @type {Firestore}
 */
const db = admin.firestore();

// Export Firestore instance
module.exports = db;
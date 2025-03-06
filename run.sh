#!/bin/bash

# Navigate to the backend directory, install dependencies, and start the backend server
echo "Starting backend server..."
cd server
npm install
PORT=5000 FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json node index.js &

# Navigate to the frontend directory, install dependencies, and start the frontend server
echo "Starting frontend server..."
cd ../client
npm install
npm start

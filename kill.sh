#!/bin/bash

# Kill the backend server
echo "Stopping backend server..."
pkill -f "node index.js"

# Kill the frontend server
echo "Stopping frontend server..."
pkill -f "npm start"

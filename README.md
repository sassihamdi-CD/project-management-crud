# Project Management App

This is a React app for managing projects and tasks, built as part of a code challenge.

## Features
- Create, view, update, and delete projects.
- Create, view, update, and delete tasks within projects.
- Mark tasks as completed/not completed.

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js (Express)
- **Database:** Firebase Firestore
- **API Calls:** Axios
- **Logging:** Winston
- **Request Validation:** Express Validator
- **Rate Limiting:** Express Rate Limit

## Setup

### Backend
- you can use an automated script **run.sh** to start and **kill.sh** to Stop,
## OR
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
 ```bash
    npm install
```

3. Create a .env file in the server folder with the following content:
```bash
PORT=5000
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json
```
    
4. Start the server:
```bash
node index.js
```

### Frontend
1. Navigate to the client folder:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React app:
    ```bash
    npm start
    ```
### Running the App
- Backend: http://localhost:5000

- Frontend: http://localhost:3000

### API Endpoints

## Projects

- **GET /api/projects:** Fetch all projects.

- **POST /api/projects:** Create a new project.

- **PUT /api/projects/:id :** Update an existing project.

- **DELETE /api/projects/:id :** Delete a project.

## Tasks

- **GET /api/tasks/:projectId :** Fetch all tasks for a specific project.

- **POST /api/tasks/:projectId :** Create a new task for a specific project.

- **PUT /api/tasks/:id :** Update an existing task.

- **DELETE /api/tasks/:id :** Delete a task.

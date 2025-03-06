/**
 * @file This file defines the routes for task management.
 * @module routes/taskRoutes
 */

const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

/**
 * @route GET /api/tasks/:projectId
 * @description Fetch all tasks for a specific project.
 * @access Public
 */
router.get('/:projectId', getTasks);

/**
 * @route POST /api/tasks/:projectId
 * @description Create a new task for a specific project.
 * @access Public
 */
router.post('/:projectId', createTask);

/**
 * @route PUT /api/tasks/:id
 * @description Update an existing task.
 * @access Public
 */
router.put('/:id', updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @description Delete a task.
 * @access Public
 */
router.delete('/:id', deleteTask);

module.exports = router;
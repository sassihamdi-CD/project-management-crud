/**
 * @file This file contains the logic for handling task-related requests.
 * @module controllers/taskController
 */

const db = require('../firebase');
const logger = require('../logger'); // Import the logger

/**
 * Fetch all tasks for a specific project.
 * @route GET /api/tasks/:projectId
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.projectId - The ID of the project.
 * @returns {Array} List of tasks.
 * @throws {Error} If the request fails.
 */
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasksRef = db.collection('tasks').where('projectId', '==', projectId);
    const snapshot = await tasksRef.get();
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    logger.info(`Fetched tasks for project ID: ${projectId}`); // Log success
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

/**
 * Create a new task for a specific project.
 * @route POST /api/tasks/:projectId
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.projectId - The ID of the project.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the task.
 * @param {boolean} req.body.completed - The completion status of the task.
 * @returns {Object} The created task.
 * @throws {Error} If the request fails.
 */
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, completed } = req.body;
    if (!title) {
      logger.warn('Title is required'); // Log warning
      return res.status(400).json({ error: 'Title is required' });
    }
    const taskRef = await db.collection('tasks').add({ projectId, title, completed: completed || false });
    logger.info(`Created task with ID: ${taskRef.id}`); // Log success
    res.status(201).json({ id: taskRef.id, projectId, title, completed });
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to create task' });
  }
};

/**
 * Update an existing task.
 * @route PUT /api/tasks/:id
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the task to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The updated title of the task.
 * @param {boolean} req.body.completed - The updated completion status of the task.
 * @returns {Object} The updated task.
 * @throws {Error} If the request fails.
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    if (!title) {
      logger.warn('Title is required'); // Log warning
      return res.status(400).json({ error: 'Title is required' });
    }
    await db.collection('tasks').doc(id).update({ title, completed });
    logger.info(`Updated task with ID: ${id}`); // Log success
    res.status(200).json({ id, title, completed });
  } catch (error) {
    logger.error(`Error updating task: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to update task' });
  }
};

/**
 * Delete a task.
 * @route DELETE /api/tasks/:id
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the task to delete.
 * @returns {Object} Confirmation message.
 * @throws {Error} If the request fails.
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('tasks').doc(id).delete();
    logger.info(`Deleted task with ID: ${id}`); // Log success
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting task: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
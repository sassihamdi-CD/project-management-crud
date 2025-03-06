/**
 * @file This file contains the logic for handling project-related requests.
 * @module controllers/projectController
 */

const db = require('../firebase');
const logger = require('../logger'); // Import the logger

/**
 * Fetch all projects.
 * @route GET /api/projects
 * @returns {Array} List of projects.
 * @throws {Error} If the request fails.
 */
const getProjects = async (req, res) => {
  try {
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.get();
    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    logger.info('Fetched all projects successfully'); // Log success
    res.status(200).json(projects);
  } catch (error) {
    logger.error(`Error fetching projects: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

/**
 * Create a new project.
 * @route POST /api/projects
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The title of the project.
 * @param {string} req.body.description - The description of the project.
 * @returns {Object} The created project.
 * @throws {Error} If the request fails.
 */
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      logger.warn('Title and description are required'); // Log warning
      return res.status(400).json({ error: 'Title and description are required' });
    }
    const projectRef = await db.collection('projects').add({ title, description });
    logger.info(`Created project with ID: ${projectRef.id}`); // Log success
    res.status(201).json({ id: projectRef.id, title, description });
  } catch (error) {
    logger.error(`Error creating project: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to create project' });
  }
};

/**
 * Update an existing project.
 * @route PUT /api/projects/:id
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the project to update.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.title - The updated title of the project.
 * @param {string} req.body.description - The updated description of the project.
 * @returns {Object} The updated project.
 * @throws {Error} If the request fails.
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      logger.warn('Title and description are required'); // Log warning
      return res.status(400).json({ error: 'Title and description are required' });
    }
    await db.collection('projects').doc(id).update({ title, description });
    logger.info(`Updated project with ID: ${id}`); // Log success
    res.status(200).json({ id, title, description });
  } catch (error) {
    logger.error(`Error updating project: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to update project' });
  }
};

/**
 * Delete a project.
 * @route DELETE /api/projects/:id
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the project to delete.
 * @returns {Object} Confirmation message.
 * @throws {Error} If the request fails.
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('projects').doc(id).delete();
    logger.info(`Deleted project with ID: ${id}`); // Log success
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting project: ${error.message}`); // Log error
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
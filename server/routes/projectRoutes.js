/**
 * @file This file defines the routes for project management.
 * @module routes/projectRoutes
 */

const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

/**
 * @route GET /api/projects
 * @description Fetch all projects.
 * @access Public
 */
router.get('/', getProjects);

/**
 * @route POST /api/projects
 * @description Create a new project.
 * @access Public
 */
router.post('/', createProject);

/**
 * @route PUT /api/projects/:id
 * @description Update an existing project.
 * @access Public
 */
router.put('/:id', updateProject);

/**
 * @route DELETE /api/projects/:id
 * @description Delete a project.
 * @access Public
 */
router.delete('/:id', deleteProject);

module.exports = router;
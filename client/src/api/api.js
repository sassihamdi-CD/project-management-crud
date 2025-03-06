import axios from 'axios';

// Base URL for the backend API
const API_URL = 'http://localhost:5000/api';

/**
 * Fetches all projects from the backend.
 * @returns {Array} List of projects.
 * @throws {Error} If the request fails.
 */
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

/**
 * Creates a new project.
 * @param {Object} project - The project to create (must contain `title` and `description`).
 * @returns {Object} The created project.
 * @throws {Error} If the request fails.
 */
export const createProject = async (project) => {
  try {
    const response = await axios.post(`${API_URL}/projects`, project);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

/**
 * Updates an existing project.
 * @param {string} id - The ID of the project to update.
 * @param {Object} project - The updated project data (must contain `title` and `description`).
 * @returns {Object} The updated project.
 * @throws {Error} If the request fails.
 */
export const updateProject = async (id, project) => {
  try {
    const response = await axios.put(`${API_URL}/projects/${id}`, project);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

/**
 * Deletes a project.
 * @param {string} id - The ID of the project to delete.
 * @returns {Object} Confirmation message.
 * @throws {Error} If the request fails.
 */
export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

/**
 * Fetches all tasks for a specific project.
 * @param {string} projectId - The ID of the project.
 * @returns {Array} List of tasks.
 * @throws {Error} If the request fails.
 */
export const fetchTasks = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Creates a new task for a specific project.
 * @param {string} projectId - The ID of the project.
 * @param {Object} task - The task to create (must contain `title` and `completed`).
 * @returns {Object} The created task.
 * @throws {Error} If the request fails.
 */
export const createTask = async (projectId, task) => {
  try {
    const response = await axios.post(`${API_URL}/tasks/${projectId}`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

/**
 * Updates an existing task.
 * @param {string} id - The ID of the task to update.
 * @param {Object} task - The updated task data (must contain `title` and `completed`).
 * @returns {Object} The updated task.
 * @throws {Error} If the request fails.
 */
export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Deletes a task.
 * @param {string} id - The ID of the task to delete.
 * @returns {Object} Confirmation message.
 * @throws {Error} If the request fails.
 */
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};
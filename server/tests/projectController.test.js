/**
 * @file This file contains unit tests for the project controller.
 * @module tests/projectController
 */

const request = require('supertest');
const app = require('../index'); // Import the Express app
const db = require('../firebase'); // Import Firestore instance

// Mock Firebase
jest.mock('../firebase');

/**
 * Test suite for the Project Controller.
 */
describe('Project Controller', () => {
  let projectId;

  /**
   * Test: Fetch all projects.
   * @function
   */
  it('should fetch all projects', async () => {
    const res = await request(app).get('/api/projects');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  /**
   * Test: Create a new project.
   * @function
   */
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'New Project', description: 'This is a new project' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('New Project');
    expect(res.body.description).toEqual('This is a new project');

    projectId = res.body.id; // Save the project ID for later tests
  });

  /**
   * Test: Update a project.
   * @function
   */
  it('should update a project', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ title: 'Updated Project', description: 'This is an updated project' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Project');
    expect(res.body.description).toEqual('This is an updated project');
  });

  /**
   * Test: Delete a project.
   * @function
   */
  it('should delete a project', async () => {
    const res = await request(app).delete(`/api/projects/${projectId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Project deleted successfully');
  });

  /**
   * Test: Create a project with missing title.
   * @function
   */
  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ description: 'This is a test project' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title is required');
  });

  /**
   * Test: Create a project with missing description.
   * @function
   */
  it('should return 400 if description is missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Test Project' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Description is required');
  });

  /**
   * Test: Update a project with invalid data.
   * @function
   */
  it('should return 400 if updating with invalid data', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ title: '', description: '' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title and description are required');
  });

  /**
   * Test: Fetch a non-existent project.
   * @function
   */
  it('should return 404 if project does not exist', async () => {
    const res = await request(app).get('/api/projects/non-existent-id');

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Project not found');
  });

  /**
   * Test: Update a non-existent project.
   * @function
   */
  it('should return 404 if updating a non-existent project', async () => {
    const res = await request(app)
      .put('/api/projects/non-existent-id')
      .send({ title: 'Updated Project', description: 'This is an updated project' });

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Project not found');
  });

  /**
   * Test: Delete a non-existent project.
   * @function
   */
  it('should return 404 if deleting a non-existent project', async () => {
    const res = await request(app).delete('/api/projects/non-existent-id');

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Project not found');
  });

  /**
   * Test: Create a project with a very long title.
   * @function
   */
  it('should return 400 if title is too long', async () => {
    const longTitle = 'a'.repeat(1001); // Title longer than 1000 characters
    const res = await request(app)
      .post('/api/projects')
      .send({ title: longTitle, description: 'This is a test project' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title must be less than 1000 characters');
  });

  /**
   * Test: Create a project with an empty payload.
   * @function
   */
  it('should return 400 if payload is empty', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title and description are required');
  });
});
/**
 * @file This file contains unit tests for the task controller.
 * @module tests/taskController
 */

const request = require('supertest');
const app = require('../index'); // Import the Express app
const db = require('../firebase'); // Import Firestore instance

// Mock Firebase
jest.mock('../firebase');

/**
 * Test suite for the Task Controller.
 */
describe('Task Controller', () => {
  let projectId;
  let taskId;

  /**
   * Create a project for testing tasks.
   * @function
   */
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'Test Project', description: 'This is a test project' });

    projectId = res.body.id;
  });

  /**
   * Test: Fetch all tasks for a project.
   * @function
   */
  it('should fetch all tasks for a project', async () => {
    const res = await request(app).get(`/api/tasks/${projectId}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  /**
   * Test: Create a new task.
   * @function
   */
  it('should create a new task', async () => {
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .send({ title: 'New Task', completed: false });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('New Task');
    expect(res.body.completed).toEqual(false);

    taskId = res.body.id; // Save the task ID for later tests
  });

  /**
   * Test: Update a task.
   * @function
   */
  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task', completed: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Task');
    expect(res.body.completed).toEqual(true);
  });

  /**
   * Test: Delete a task.
   * @function
   */
  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Task deleted successfully');
  });

  /**
   * Test: Create a task with missing title.
   * @function
   */
  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .send({ completed: false });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title is required');
  });

  /**
   * Test: Create a task with invalid completed status.
   * @function
   */
  it('should return 400 if completed is not a boolean', async () => {
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .send({ title: 'Test Task', completed: 'not-a-boolean' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Completed must be a boolean');
  });

  /**
   * Test: Update a task with invalid data.
   * @function
   */
  it('should return 400 if updating with invalid data', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: '', completed: 'not-a-boolean' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title is required');
  });

  /**
   * Test: Fetch tasks for a non-existent project.
   * @function
   */
  it('should return 404 if project does not exist', async () => {
    const res = await request(app).get('/api/tasks/non-existent-id');

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Project not found');
  });

  /**
   * Test: Update a non-existent task.
   * @function
   */
  it('should return 404 if updating a non-existent task', async () => {
    const res = await request(app)
      .put('/api/tasks/non-existent-id')
      .send({ title: 'Updated Task', completed: true });

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Task not found');
  });

  /**
   * Test: Delete a non-existent task.
   * @function
   */
  it('should return 404 if deleting a non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/non-existent-id');

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Task not found');
  });

  /**
   * Test: Create a task with a very long title.
   * @function
   */
  it('should return 400 if title is too long', async () => {
    const longTitle = 'a'.repeat(1001); // Title longer than 1000 characters
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .send({ title: longTitle, completed: false });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title must be less than 1000 characters');
  });

  /**
   * Test: Create a task with an empty payload.
   * @function
   */
  it('should return 400 if payload is empty', async () => {
    const res = await request(app)
      .post(`/api/tasks/${projectId}`)
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Title is required');
  });

  /**
   * Delete the test project after all tests are done.
   * @function
   */
  afterAll(async () => {
    await request(app).delete(`/api/projects/${projectId}`);
  });
});
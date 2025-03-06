import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';
import { createTask } from '../api/api';

// Mock the API function
jest.mock('../api/api', () => ({
  createTask: jest.fn(),
}));

describe('TaskForm', () => {
  const onSaveMock = jest.fn();
  const projectId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render the form
  it('renders the form with the correct input and button', () => {
    render(<TaskForm projectId={projectId} onSave={onSaveMock} />);

    expect(screen.getByPlaceholderText('Task Title')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  // Test 2: Handle user input
  it('updates the title field when user types', () => {
    render(<TaskForm projectId={projectId} onSave={onSaveMock} />);

    const titleInput = screen.getByPlaceholderText('Task Title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    expect(titleInput.value).toBe('New Task');
  });

  // Test 3: Submit the form with valid input
  it('submits the form and calls the createTask API', async () => {
    createTask.mockResolvedValueOnce({});

    render(<TaskForm projectId={projectId} onSave={onSaveMock} />);

    const titleInput = screen.getByPlaceholderText('Task Title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.submit(screen.getByText('Add Task'));

    expect(createTask).toHaveBeenCalledWith(projectId, {
      title: 'New Task',
      completed: false,
    });
    expect(onSaveMock).toHaveBeenCalled();
  });

  // Test 4: Display error message when title is empty
  it('displays an error message when title is empty', () => {
    render(<TaskForm projectId={projectId} onSave={onSaveMock} />);

    fireEvent.submit(screen.getByText('Add Task'));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  // Test 5: Display error message when API call fails
  it('displays an error message when API call fails', async () => {
    createTask.mockRejectedValueOnce(new Error('API Error'));

    render(<TaskForm projectId={projectId} onSave={onSaveMock} />);

    const titleInput = screen.getByPlaceholderText('Task Title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.submit(screen.getByText('Add Task'));

    expect(await screen.findByText('Failed to create task')).toBeInTheDocument();
  });
});
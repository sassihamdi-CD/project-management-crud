import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TasksList from './TasksList';
import { fetchTasks, updateTask, deleteTask } from '../api/api';

// Mock the API functions
jest.mock('../api/api', () => ({
  fetchTasks: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

describe('TasksList', () => {
  const projectId = 1;
  const mockTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render the component
  it('renders the component without errors', () => {
    render(<TasksList projectId={projectId} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  // Test 2: Fetch and display tasks
  it('fetches and displays tasks', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);

    render(<TasksList projectId={projectId} />);

    // Wait for tasks to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  // Test 3: Toggle task completion status
  it('toggles task completion status when checkbox is clicked', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);
    updateTask.mockResolvedValueOnce({});

    render(<TasksList projectId={projectId} />);

    // Wait for tasks to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click the checkbox for the first task
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Verify the updateTask API was called
    expect(updateTask).toHaveBeenCalledWith(1, { completed: true });

    // Verify the task's completion status is updated
    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
    });
  });

  // Test 4: Delete a task
  it('deletes a task when the delete button is clicked', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);
    deleteTask.mockResolvedValueOnce({});

    render(<TasksList projectId={projectId} />);

    // Wait for tasks to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Mock the window.confirm dialog
    window.confirm = jest.fn(() => true);

    // Click the delete button for the first task
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Verify the deleteTask API was called
    expect(deleteTask).toHaveBeenCalledWith(1);

    // Verify the task is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });
  });

  // Test 5: Display error message when fetching tasks fails
  it('displays an error message when fetching tasks fails', async () => {
    fetchTasks.mockRejectedValueOnce(new Error('Failed to fetch tasks'));

    render(<TasksList projectId={projectId} />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
    });
  });

  // Test 6: Display error message when updating a task fails
  it('displays an error message when updating a task fails', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);
    updateTask.mockRejectedValueOnce(new Error('Failed to update task'));

    render(<TasksList projectId={projectId} />);

    // Wait for tasks to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click the checkbox for the first task
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to update task')).toBeInTheDocument();
    });
  });

  // Test 7: Display error message when deleting a task fails
  it('displays an error message when deleting a task fails', async () => {
    fetchTasks.mockResolvedValueOnce(mockTasks);
    deleteTask.mockRejectedValueOnce(new Error('Failed to delete task'));

    render(<TasksList projectId={projectId} />);

    // Wait for tasks to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Mock the window.confirm dialog
    window.confirm = jest.fn(() => true);

    // Click the delete button for the first task
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to delete task')).toBeInTheDocument();
    });
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectsList from './ProjectsList';
import { fetchProjects, deleteProject } from '../api/api';

// Mock the API functions
jest.mock('../api/api', () => ({
  fetchProjects: jest.fn(),
  deleteProject: jest.fn(),
}));

describe('ProjectsList', () => {
  const mockProjects = [
    { id: 1, title: 'Project 1', description: 'Description 1' },
    { id: 2, title: 'Project 2', description: 'Description 2' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render the component
  it('renders the component with the correct heading', () => {
    render(<ProjectsList />);

    expect(screen.getByText('Project Management App')).toBeInTheDocument();
    expect(screen.getByText('Add Project')).toBeInTheDocument();
  });

  // Test 2: Fetch and display projects
  it('fetches and displays projects', async () => {
    fetchProjects.mockResolvedValueOnce(mockProjects);

    render(<ProjectsList />);

    // Wait for projects to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });

  // Test 3: Show the project form when "Add Project" is clicked
  it('shows the project form when "Add Project" is clicked', () => {
    render(<ProjectsList />);

    fireEvent.click(screen.getByText('Add Project'));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  // Test 4: Delete a project
  it('deletes a project when the delete button is clicked', async () => {
    fetchProjects.mockResolvedValueOnce(mockProjects);
    deleteProject.mockResolvedValueOnce({});

    render(<ProjectsList />);

    // Wait for projects to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    // Mock the window.confirm dialog
    window.confirm = jest.fn(() => true);

    // Click the delete button for the first project
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Verify the delete API was called
    expect(deleteProject).toHaveBeenCalledWith(1);

    // Verify the project is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Project 1')).not.toBeInTheDocument();
    });
  });

  // Test 5: Display error message when fetching projects fails
  it('displays an error message when fetching projects fails', async () => {
    fetchProjects.mockRejectedValueOnce(new Error('Failed to fetch projects'));

    render(<ProjectsList />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument();
    });
  });

  // Test 6: Display error message when deleting a project fails
  it('displays an error message when deleting a project fails', async () => {
    fetchProjects.mockResolvedValueOnce(mockProjects);
    deleteProject.mockRejectedValueOnce(new Error('Failed to delete project'));

    render(<ProjectsList />);

    // Wait for projects to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    // Mock the window.confirm dialog
    window.confirm = jest.fn(() => true);

    // Click the delete button for the first project
    fireEvent.click(screen.getAllByText('Delete')[0]);

    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to delete project')).toBeInTheDocument();
    });
  });
});
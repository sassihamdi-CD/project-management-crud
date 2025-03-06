import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectForm from './ProjectForm';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('ProjectForm', () => {
  const onSaveMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Render the form for creating a new project
  it('renders the form for creating a new project', () => {
    render(<ProjectForm onSave={onSaveMock} />);

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add Project')).toBeInTheDocument();
  });

  // Test 2: Render the form for updating an existing project
  it('renders the form for updating an existing project', () => {
    const project = { id: 1, title: 'Test Project', description: 'Test Description' };
    render(<ProjectForm project={project} onSave={onSaveMock} />);

    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Update Project')).toBeInTheDocument();
  });

  // Test 3: Handle user input
  it('updates the title and description fields when user types', () => {
    render(<ProjectForm onSave={onSaveMock} />);

    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    expect(titleInput.value).toBe('New Title');
    expect(descriptionInput.value).toBe('New Description');
  });

  // Test 4: Submit the form for creating a new project
  it('submits the form for creating a new project', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<ProjectForm onSave={onSaveMock} />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
    fireEvent.submit(screen.getByText('Add Project'));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/projects', {
      title: 'New Title',
      description: 'New Description',
    });
    expect(onSaveMock).toHaveBeenCalled();
  });

  // Test 5: Submit the form for updating an existing project
  it('submits the form for updating an existing project', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });

    const project = { id: 1, title: 'Old Title', description: 'Old Description' };
    render(<ProjectForm project={project} onSave={onSaveMock} />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Updated Description' } });
    fireEvent.submit(screen.getByText('Update Project'));

    expect(axios.put).toHaveBeenCalledWith(`http://localhost:5000/api/projects/${project.id}`, {
      title: 'Updated Title',
      description: 'Updated Description',
    });
    expect(onSaveMock).toHaveBeenCalled();
  });

  // Test 6: Display error message when required fields are missing
  it('displays an error message when required fields are missing', () => {
    render(<ProjectForm onSave={onSaveMock} />);

    fireEvent.submit(screen.getByText('Add Project'));

    expect(screen.getByText('Title and description are required')).toBeInTheDocument();
  });

  // Test 7: Display error message when API call fails
  it('displays an error message when API call fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    render(<ProjectForm onSave={onSaveMock} />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
    fireEvent.submit(screen.getByText('Add Project'));

    expect(await screen.findByText('Failed to save project')).toBeInTheDocument();
  });
});
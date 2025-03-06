import React, { useState } from 'react';
import { createProject, updateProject } from '../api/api';

const ProjectForm = ({ project, onSave }) => {
  const [title, setTitle] = useState(project ? project.title : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    try {
      const newProject = { title, description };
      if (project) {
        await updateProject(project.id, newProject);
      } else {
        await createProject(newProject);
      }
      onSave();
    } catch (error) {
      setError('Failed to save project');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">{project ? 'Update' : 'Add'} Project</button>
    </form>
  );
};

export default ProjectForm;
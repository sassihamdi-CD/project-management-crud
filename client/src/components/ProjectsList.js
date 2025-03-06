import React, { useEffect, useState } from 'react';
import { fetchProjects, deleteProject } from '../api/api';
import ProjectForm from './ProjectForm';
import TasksList from './TasksList';
import TaskForm from './TaskForm';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [error, setError] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        setError('Failed to fetch projects');
        console.error(error);
      }
    };
    getProjects();
  }, []);

  /**
   * Handles deleting a project.
   * @param {string} id - The ID of the project to delete.
   */
  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter((project) => project.id !== id));
      } catch (error) {
        setError('Failed to delete project');
        console.error(error);
      }
    }
  };

  /**
   * Handles adding a new project.
   */
  const handleAddProject = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
      setShowProjectForm(false);
    } catch (error) {
      setError('Failed to add project');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Project Management App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Projects</h2>
      <button onClick={() => setShowProjectForm(!showProjectForm)}>
        {showProjectForm ? 'Cancel' : 'Add Project'}
      </button>
      {showProjectForm && <ProjectForm onSave={handleAddProject} />}

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong onClick={() => setSelectedProjectId(project.id)}>
              {project.title}
            </strong> - {project.description}
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedProjectId && (
        <div>
          <h3>Tasks for Selected Project</h3>
          <TaskForm projectId={selectedProjectId} onSave={() => setSelectedProjectId(null)} />
          <TasksList projectId={selectedProjectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
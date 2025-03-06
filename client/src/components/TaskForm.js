import React, { useState } from 'react';
import { createTask } from '../api/api';

const TaskForm = ({ projectId, onSave }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    try {
      await createTask(projectId, { title, completed: false });
      onSave();
      setTitle('');
    } catch (error) {
      setError('Failed to create task');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
import React, { useEffect, useState } from 'react';
import { fetchTasks, updateTask, deleteTask } from '../api/api';

const TasksList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  // Fetch tasks when the projectId changes
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(projectId);
        setTasks(data);
      } catch (error) {
        setError('Failed to fetch tasks');
        console.error(error);
      }
    };
    getTasks();
  }, [projectId]);

  /**
   * Handles toggling a task's completion status.
   * @param {string} id - The ID of the task to update.
   * @param {boolean} completed - The new completion status.
   */
  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTask(id, { completed: !completed });
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !completed } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      setError('Failed to update task');
      console.error(error);
    }
  };

  /**
   * Handles deleting a task.
   * @param {string} id - The ID of the task to delete.
   */
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (error) {
        setError('Failed to delete task');
        console.error(error);
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id, task.completed)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
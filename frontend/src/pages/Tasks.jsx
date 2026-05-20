import { useEffect, useState } from 'react';
import { createTask, getProjects, getTasks, getUsers } from '../api';

const defaultTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignee: '',
  project: '',
};

export default function Tasks({ token, user }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(defaultTask);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setTasks(await getTasks(token));
        setProjects(await getProjects(token));
        setUsers(await getUsers(token));
      } catch (err) {
        setError(err.message);
      }
    };
    loadData();
  }, [token]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createTask(formData, token);
      setFormData(defaultTask);
      setTasks(await getTasks(token));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-heading">Tasks</h1>
      <p className="section-subtitle">Add tasks, assign team members, and keep a clean status view for your current workflow.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="full-width">
          Title
          <input value={formData.title} onChange={handleChange('title')} required />
        </label>
        <label className="full-width">
          Description
          <textarea value={formData.description} onChange={handleChange('description')} />
        </label>
        <label className="full-width">
          Project
          <select value={formData.project} onChange={handleChange('project')} required>
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Assignee
          <select value={formData.assignee} onChange={handleChange('assignee')}>
            <option value="">Unassigned</option>
            {users.map((userItem) => (
              <option key={userItem._id} value={userItem._id}>
                {userItem.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={formData.status} onChange={handleChange('status')}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select value={formData.priority} onChange={handleChange('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Due date
          <input type="date" value={formData.dueDate} onChange={handleChange('dueDate')} />
        </label>
        <button type="submit">Create task</button>
      </form>
      <div className="list-box">
        {tasks.map((task) => (
          <div key={task._id} className="card">
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p>Project: {task.project?.name || 'Unknown'}</p>
            <p>Assignee: {task.assignee?.name || 'Unassigned'}</p>
            <p>
              Status: <span className={`status-chip ${task.status}`}>{task.status}</span>
            </p>
            <p>
              Priority: <span className={`priority-chip ${task.priority}`}>{task.priority}</span>
            </p>
            <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

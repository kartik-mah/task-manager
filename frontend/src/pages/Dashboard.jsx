import { useEffect, useState } from 'react';
import { getProjects, getTasks } from '../api';

export default function Dashboard({ token, user }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const projectsData = await getProjects(token);
        const tasksData = await getTasks(token);
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [token]);

  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done');
  const completed = tasks.filter((task) => task.status === 'done').length;
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
  const todo = tasks.filter((task) => task.status === 'todo').length;

  return (
    <section>
      <h1 className="page-heading">Dashboard</h1>
      <p className="section-subtitle">Track your projects and tasks in one place with quick status cards and overdue alerts.</p>
      {error && <p className="error">{error}</p>}
      <div className="grid-cards">
        <div className="card">
          <h2>Welcome, {user?.name}</h2>
          <p>Role: {user?.role}</p>
          <p>Projects: {projects.length}</p>
        </div>
        <div className="card">
          <h2>Task Summary</h2>
          <p>Todo: {todo}</p>
          <p>In Progress: {inProgress}</p>
          <p>Done: {completed}</p>
          <p>Overdue: {overdueTasks.length}</p>
        </div>
      </div>

      <div className="overview">
        <h2>Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p>All tasks are up to date.</p>
        ) : (
          <ul className="list-box">
            {overdueTasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> for project {task.project?.name || 'Unknown'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

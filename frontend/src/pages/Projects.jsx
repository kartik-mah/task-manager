import { useEffect, useState } from 'react';
import { createProject, getProjects, getUsers } from '../api';

export default function Projects({ token, user }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setProjects(await getProjects(token));
        setUsers(await getUsers(token));
      } catch (err) {
        setError(err.message);
      }
    };
    loadData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createProject({ name, description, members }, token);
      setName('');
      setDescription('');
      setMembers([]);
      setProjects(await getProjects(token));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h1 className="page-heading">Projects</h1>
      <p className="section-subtitle">Create and manage project teams, then quickly see who is assigned and what is in progress.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="full-width">
          Project name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="full-width">
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="full-width">
          Add members
          <select multiple value={members} onChange={(e) => setMembers(Array.from(e.target.selectedOptions, (opt) => opt.value))}>
            {users.map((userItem) => (
              <option key={userItem._id} value={userItem._id}>
                {userItem.name} ({userItem.role})
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Create project</button>
      </form>

      <div className="list-box">
        {projects.map((project) => (
          <div key={project._id} className="card">
            <h3>{project.name}</h3>
            <p>{project.description || 'No description yet'}</p>
            <p>Owner: {project.owner?.name || 'Unknown'}</p>
            <p>Members: {project.members?.length || 0}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

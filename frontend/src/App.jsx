import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import './App.css';
import { getProfile } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ttm_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('ttm_token');
          setUser(null);
        });
    }
  }, [token]);

  const handleLogin = (token, userData) => {
    setToken(token);
    localStorage.setItem('ttm_token', token);
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ttm_token');
    setUser(null);
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="app-shell">
        <div className="auth-box">
          <div className="auth-card">
            <div className="brand auth-brand">Team Task Manager</div>
            <Routes>
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Team Task Manager</div>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard token={token} user={user} />} />
          <Route path="/projects" element={<Projects token={token} user={user} />} />
          <Route path="/tasks" element={<Tasks token={token} user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

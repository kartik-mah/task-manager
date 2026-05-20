const API_URL = import.meta.env.VITE_API_URL || '';

const jsonOptions = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export async function request(path, method = 'GET', body, token) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    ...jsonOptions(token),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const loginUser = (body) => request('/api/auth/login', 'POST', body);
export const registerUser = (body) => request('/api/auth/register', 'POST', body);
export const getProfile = (token) => request('/api/auth/profile', 'GET', null, token);
export const getProjects = (token) => request('/api/projects', 'GET', null, token);
export const createProject = (body, token) => request('/api/projects', 'POST', body, token);
export const getTasks = (token) => request('/api/tasks', 'GET', null, token);
export const createTask = (body, token) => request('/api/tasks', 'POST', body, token);
export const getUsers = (token) => request('/api/users', 'GET', null, token);

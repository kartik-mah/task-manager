# Team Task Manager

A full-stack task management web app for teams with role-based access control.

## What is included

- Backend API with Express + MongoDB
- JWT authentication (signup/login)
- Role support: `admin` and `member`
- Projects, tasks, assignments, status, overdue tracking
- React frontend with dashboard, project management, and task creation

## Getting started

### 1. Backend setup

```bash
npm run install:all
```

Create `backend/.env` or copy `backend/.env.example` and update values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_here
```

Start the backend:

```bash
npm run start:backend
```

### 2. Frontend setup

```bash
npm run start:frontend
```

If you prefer to install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Open the local URL shown by Vite.

### 3. Connect frontend to backend

If your backend runs locally, no extra changes are needed. If you deploy backend to Railway, create `frontend/.env` with:

```env
VITE_API_URL=https://your-railway-backend-url
```

Then rebuild or restart the frontend.

## Deployment notes

### Deploy backend to Railway

1. Push this repo to GitHub.
2. Create a Railway project.
3. Connect the GitHub repo.
4. Set environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional)
5. Railway will deploy the backend automatically.

### Deploy frontend

Option 1: Host on Vercel or Netlify and set `VITE_API_URL` to your Railway backend URL.

Option 2: Use Railway static site hosting for the frontend if you want everything on Railway.

## What to change

- `backend/.env`: set your MongoDB URI and JWT secret
- `frontend/.env`: set `VITE_API_URL` after backend is deployed
- `backend/routes/projectRoutes.js` and `backend/routes/taskRoutes.js`: adjust access rules if you want stricter permissions

## Recommended demo flow

1. Sign up as admin and member
2. Create a project and invite team members
3. Add tasks, assign them, and change status
4. Show dashboard counts and overdue tasks

## Optional improvements

- Add task editing and deletion from frontend
- Add project member management UI
- Add better styling and dashboard charts
- Add email notifications or comments

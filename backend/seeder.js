const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' });
    const member = await User.create({ name: 'Team Member', email: 'member@example.com', password: 'password123', role: 'member' });

    const project = await Project.create({ name: 'Sample Project', description: 'A seeded project', owner: admin._id, members: [member._id] });

    const task1 = await Task.create({ title: 'Setup repo', description: 'Initialize repository and basic scaffold', status: 'todo', priority: 'high', dueDate: new Date(Date.now() + 3*24*60*60*1000), assignee: member._id, project: project._id, createdBy: admin._id });
    const task2 = await Task.create({ title: 'Create README', description: 'Add project README and deployment notes', status: 'in-progress', priority: 'medium', dueDate: new Date(Date.now() + 5*24*60*60*1000), assignee: member._id, project: project._id, createdBy: admin._id });

    console.log('Seed data created:');
    console.log({ admin: { id: admin._id, email: admin.email }, member: { id: member._id, email: member.email }, project: { id: project._id, name: project.name } });
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();

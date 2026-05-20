const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.owner.equals(req.user._id) && !project.members.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot add tasks to this project' });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      assignee: req.body.assignee,
      project: req.body.project,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user._id }, { assignee: req.user._id }],
    })
      .populate('assignee', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.createdBy.equals(req.user._id) && !task.assignee?.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to update this task' });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.assignee = req.body.assignee || task.assignee;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to delete this task' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({message: 'Failed to delete task', error: error.message});
  }
});

module.exports = router;

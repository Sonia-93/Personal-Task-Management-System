const Task = require('../models/task');
const User = require('../models/Users');
const { createTaskSchema, updateTaskSchema } = require('../middlewaare/joi');


const getAllTasks = async (req, res) => {
  try {
   
    const tasks = await Task.find().populate('user', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task id format' });
    res.status(500).json({ message: 'Server error' });
  }
};


const createTask = async (req, res) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    
    const userExists = await User.findById(value.user);
    if (!userExists) return res.status(404).json({ message: 'User not found. Provide a valid user id.' });

    const task = await Task.create({
      title: value.title,
      category: value.category,
      priority: value.priority,
      status: value.status,
      duedate: value.duedate,
      user: value.user
    });

    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid user id format' });
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

   
    const task = await Task.findOne({ _id: req.params.id, user: value.user });
    if (!task) return res.status(404).json({ message: 'Task not found or you are not authorized to update it' });

   
    const { user, ...updateFields } = value;

    const updated = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);

  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id format' });
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task id format' });
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
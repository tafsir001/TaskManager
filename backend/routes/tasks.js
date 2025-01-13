const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// Import task controller functions
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');

// Fetch all tasks for a user
router.get('/gettasks', fetchuser, getTasks);

// Add a new task
router.post('/addtask', fetchuser, [
    body('title', 'Enter a title').isLength({ min: 1 }),
    body('description', 'Enter a description').isLength({ min: 1 }),
], addTask);

// Update a task
router.put('/updatetask/:id', fetchuser, [
    body('title', 'Enter a title').isLength({ min: 1 }),
    body('description', 'Enter a description').isLength({ min: 1 }),
], updateTask);

// Delete a task
router.delete('/deletetask/:id', fetchuser, deleteTask);

module.exports = router;

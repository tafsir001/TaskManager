const { validationResult } = require('express-validator');
const Tasks = require('../models/Tasks');

// Fetch all tasks for a particular user
const getTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

// Add a new task
const addTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, status } = req.body;
        const task = new Tasks({ title, description, status, user: req.user.id });
        const savedTask = await task.save();
        res.json(savedTask);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, status } = req.body;

        // Create a new task object
        let updatedTask = {};
        if (title) updatedTask.title = title;
        if (description) updatedTask.description = description;
        if (status) updatedTask.status = status;

        // Find the task to update
        let task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).send({ error: "No Task Found" });
        }

        // Check if the user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Update the task
        task = await Tasks.findByIdAndUpdate(req.params.id, { $set: updatedTask }, { new: true });
        res.json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        let task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).send({ error: "No Task Found" });
        }

        // Check if the user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        // Delete the task
        task = await Tasks.findByIdAndDelete(req.params.id);
        res.json({ Status: "Success", task });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };

const express = require('express');
const router = express.Router();
const Tasks = require('../models/Tasks');
const { body, validationResult } = require('express-validator');
const fethuser = require('../middleware/fetchuser');

//Fetching all tasks for a particular user using: POST "/api/tasks/gettasks". Require Authentication
router.get('/gettasks', fethuser, async (req, res) => {

    try {
        const tasks = await Tasks.find({ user: req.user.id });
        res.json(tasks);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})

//Add a task using: POST "/api/tasks/addtask". Require Authentication
router.post('/addtask', fethuser, [
    body('title', 'Enter a title').isLength({ min: 1 }),
    body('description', 'Enter a description').isLength({ min: 1 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, status } = req.body;
        const tasks = new Tasks({ title, description, status, user: req.user.id });
        const savedTasks = await tasks.save();
        res.json(savedTasks);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})


//Update a task using: Put "/api/tasks/updatetask". Require Authentication
router.put('/updatetask/:id', fethuser, [
    body('title', 'Enter a title').isLength({ min: 1 }),
    body('description', 'Enter a description').isLength({ min: 1 }),
], async (req, res) => {

    //Validate req body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, status } = req.body;

        let updatedTask = {};
        if (title) {
            updatedTask.title = title;
        }
        if (description) {
            updatedTask.description = description;
        }
        if (status) {
            updatedTask.status = status;
        }

        //Find Task to be updated and update it
        let task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).send({ error: "No Task Found" });
        }
        //Allow Updation only if user owns this Task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        task = await Tasks.findByIdAndUpdate(req.params.id, { $set: updatedTask }, { new: true });
        res.json(task);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})


//Delete a task using: Put "/api/tasks/deletetask". Require Authentication
router.delete('/deletetask/:id', fethuser,  async (req, res) => {

    try {

        //Find Task to be deleted and delete it
        let task = await Tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).send({ error: "No Task Found" });
        }
        //Allow Deletion only if user owns this Task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        task = await Tasks.findByIdAndDelete(req.params.id);
        res.json({ Status : "Success" ,task});

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})

module.exports = router;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const user = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

// Create a User
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let newUser = await user.findOne({ email: req.body.email });
        if (newUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        newUser = await user.create({
            username: req.body.username,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: newUser.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

// Login a User
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let loginUser = await user.findOne({ email: email });
        if (!loginUser) {
            return res.status(400).json({ error: "Please enter valid credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, loginUser.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please enter valid credentials" });
        }

        const data = {
            user: {
                id: loginUser.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

// Get logged-in User details
const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await user.findById(userId).select("-password");
        res.send(userDetails);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occurred" });
    }
};

module.exports = { createUser, loginUser, getUser };

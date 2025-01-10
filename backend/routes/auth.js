const express = require('express');
const router = express.Router();
const user = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fethuser = require('../middleware/fetchuser');


const JWT_SECRET = process.env.JWT_SECRET;
//Create a User using: POST "/api/auth/createUser". Doesn't require Authentication
router.post('/createUser', [
    body('email', 'Enter a valid email').isEmail(),
    body('username', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 3 characters').isLength({ min: 3 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let newUser = await user.findOne({ email: req.body.email });
        if (newUser) {
            return res.status(400).json({ error: "User with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        newUser = await user.create(
            {
                username: req.body.username,
                email: req.body.email,
                password: secPass
            }
        )

        const data = {
            user: {
                id: newUser.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})


//Login a User using: POST "/api/auth/login". Doesn't require Authentication
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Destructure the req.body
    const { email, password } = req.body;
    try {

        let loginUser = await user.findOne({ email: email });
        if (!loginUser) {
            return res.status(400).json({ error: "Please enter valid credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, loginUser.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please enter valid credentials" })
        }

        const data = {
            user: {
                id: loginUser.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.send({ authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})


//Get loggedin User details using: POST "/api/auth/getuser". Require Authentication
router.get('/getuser', fethuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const userDetails = await user.findById(userId).select("-password");
        res.send(userDetails);
     
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Some error occured" });
    }
})

module.exports = router
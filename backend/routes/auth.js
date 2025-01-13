const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const fethuser = require('../middleware/fetchuser');

// Import controller functions
const { createUser, loginUser, getUser } = require('../controllers/authController');

// Create a User using: POST "/api/auth/createUser". Doesn't require Authentication
router.post('/createUser', [
    body('email', 'Enter a valid email').isEmail(),
    body('username', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 3 characters').isLength({ min: 3 }),
], createUser);

// Login a User using: POST "/api/auth/login". Doesn't require Authentication
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], loginUser);

// Get logged-in User details using: POST "/api/auth/getuser". Requires Authentication
router.get('/getuser', fethuser, getUser);

module.exports = router;

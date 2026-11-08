const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // The schema we created earlier

const router = express.Router();

// POST: Register a new user or admin
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'user' // Defaults to 'user' if not specified
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Login and generate a token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Generate the authentication token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "supersecretkey123", // In production, put this in .env
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role, message: "Login successful!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
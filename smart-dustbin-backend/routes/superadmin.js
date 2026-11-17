const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
let bcrypt;
try { bcrypt = require('bcryptjs'); } catch(e) { bcrypt = require('bcrypt'); }

// Get all users
router.get("/all-users", async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Update any user's role
router.put("/change-role/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.newRole }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update role" });
    }
});

// Approve Pending User
router.put("/approve-user/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to approve user" });
    }
});

// Manually Add New User (Auto-Approved)
router.post("/add-user", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, password: hashedPassword, role, status: 'approved' });
        await newUser.save();
        res.json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Email may already exist." });
    }
});

// Public Registration Request with Email Alert
router.post("/register-request", async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already registered." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ 
            name, email, phone, address, password: hashedPassword, role: 'user', status: 'pending' 
        });
        await newUser.save();

        // Send Email Alert Asynchronously
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dhalisatyapriya794@gmail.com',
                    pass: process.env.EMAIL_APP_PASSWORD || ''
                }
            });

            const mailOptions = {
                from: 'dhalisatyapriya794@gmail.com',
                to: 'dhalisatyapriya794@gmail.com',
                subject: `🔔 ACTION REQUIRED: New IoT Registration (${name})`,
                html: `<h3>New Account Approval Needed</h3>
                       <p><b>Name:</b> ${name}</p>
                       <p><b>Email:</b> ${email}</p>
                       <p><b>Phone:</b> ${phone}</p>
                       <p><b>Assigned Zone:</b> ${address}</p>
                       <br/>
                       <p>Please log in to the Superadmin dashboard to approve this account.</p>`
            };
            transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.warn("Email alert skipped - App Password missing in Render config.");
        }

        res.json({ success: true, message: 'Registration submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: "Registration failed." });
    }
});

module.exports = router;
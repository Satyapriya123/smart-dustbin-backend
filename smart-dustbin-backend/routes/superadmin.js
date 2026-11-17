const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust if your model is named differently

// Update any user's role
router.put("/change-role/:id", async (req, res) => {
    try {
        const { newRole } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Get all users
router.get("/all-users", async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;

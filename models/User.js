const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // The hashed password will be saved here
    role: { type: String, default: 'user' },    // Defines clearance levels (admin vs user)
    createdAt: { type: Date, default: Date.now }
});

// Export the blueprint so your authRoutes can access it
module.exports = mongoose.model('User', userSchema);
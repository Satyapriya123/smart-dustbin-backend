const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'approved' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
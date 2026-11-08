const mongoose = require('mongoose');

const dustbinSchema = new mongoose.Schema({
    binId: { type: String, required: true, unique: true }, 
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String },
    fillLevel: { type: Number, default: 0 }, 
    status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'offline' }
}, { timestamps: true });

module.exports = mongoose.model('Dustbin', dustbinSchema);
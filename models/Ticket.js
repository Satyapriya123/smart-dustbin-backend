const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    binId: { type: String, required: true },
    issue: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'Pending Review' },
    raisedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);

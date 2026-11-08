const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    binId: { type: String, required: true },
    issue: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'Pending Review' }, // Statuses: Pending Review, In Progress, Resolved
    raisedBy: { type: String, required: true }, // Links the ticket to the user's email
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
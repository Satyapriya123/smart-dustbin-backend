const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// 1. Submit a new ticket
router.post('/raise', async (req, res) => {
    try {
        const { binId, issue, description, raisedBy } = req.body;
        const newTicket = new Ticket({ binId, issue, description, raisedBy });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: "Failed to raise ticket" });
    }
});

// 2. Get all tickets (Renamed to /admin/all to prevent email route conflicts)
router.get('/admin/all', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch all tickets" });
    }
});

// 3. Update ticket status 
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Failed to update ticket status" });
    }
});

// 4. Get tickets specific to the logged-in user
router.get('/:email', async (req, res) => {
    try {
        const userTickets = await Ticket.find({ raisedBy: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(userTickets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tickets" });
    }
});

// 5. Delete a ticket
router.delete('/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Ticket permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete ticket" });
    }
});

module.exports = router;
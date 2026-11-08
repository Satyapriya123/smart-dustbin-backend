const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// Submit
router.post('/raise', async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

// ADMIN FETCH 
router.get('/admin-dashboard/get-all', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

// Update Status
router.put('/:id/status', async (req, res) => {
    try {
        const updated = await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.status(200).json(updated);
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

// USER FETCH
router.get('/user-dashboard/get/:email', async (req, res) => {
    try {
        const userTickets = await Ticket.find({ raisedBy: req.params.email }).sort({ createdAt: -1 });
        res.status(200).json(userTickets);
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Dustbin = require('../models/Dustbin'); 

router.get('/', async (req, res) => {
    try {
        const dustbins = await Dustbin.find();
        res.json(dustbins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newBin = new Dustbin(req.body);
        const savedBin = await newBin.save();
        res.status(201).json(savedBin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
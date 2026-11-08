require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // <-- Nodemailer added here

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error: ", err));

// Routes
const dustbinRoutes = require('./routes/dustbinRoutes');
const authRoutes = require('./routes/authRoutes'); 
const ticketRoutes = require('./routes/ticketRoutes'); // <-- Moved up here

app.use('/api/dustbins', dustbinRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/tickets', ticketRoutes); // <-- Moved up here

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "Smart Dustbin Backend is communicating perfectly!" });
});

// --- Real Email Verification Route ---
app.post('/api/auth/send-code', async (req, res) => {
    const { email } = req.body;
    
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString(); 

    // Configure your email sender
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dhalisatyapriya794@gmail.com',      
            pass: 'fogubcskngiypuor'          
        }
    });

    const mailOptions = {
        from: 'dhalisatyapriya794@gmail.com',  
        to: email,
        subject: 'Smart Dustbin - Verification Code',
        html: `
            <h2>Security Verification</h2>
            <p>Your 6-digit access code for the Smart Dustbin network is:</p>
            <h1 style="color: #3b82f6; letter-spacing: 5px;">${code}</h1>
            <p>If you did not request this, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        // Send the code back to React so it can verify what the user types
        res.status(200).json({ message: 'Email sent successfully', code: code }); 
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

// Start the Server (Only once at the very bottom!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
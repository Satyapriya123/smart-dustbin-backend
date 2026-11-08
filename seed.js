require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Dustbin = require('./models/Dustbin');

const seedDatabase = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        // This 'await' forces the script to wait for a successful connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected! Injecting data...");

        // Clear existing data
        await User.deleteMany();
        await Dustbin.deleteMany();

        // Create Admin
        const adminPassword = await bcrypt.hash("admin123", 10);
        await User.create({ 
            name: "Admin User", 
            email: "admin@test.com", 
            password: adminPassword, 
            role: "admin" 
        });

        // Create User
        const userPassword = await bcrypt.hash("user123", 10);
        await User.create({ 
            name: "City Resident", 
            email: "user@test.com", 
            password: userPassword, 
            role: "user" 
        });

        // Create Dustbins
        await Dustbin.create([
            { 
                binId: "BIN-001", 
                location: { lat: 22.5726, lng: 88.3639 }, 
                address: "Park Street Area", 
                fillLevel: 15, 
                status: "online" 
            },
            { 
                binId: "BIN-002", 
                location: { lat: 22.5892, lng: 88.4111 }, 
                address: "Salt Lake Sector V", 
                fillLevel: 85, 
                status: "online" 
            }
        ]);

        console.log("✅ Dummy Data Injected Successfully!");
        process.exit(); 
    } catch (error) {
        console.error("❌ Error injecting data:", error);
        process.exit(1);
    }
};

seedDatabase();
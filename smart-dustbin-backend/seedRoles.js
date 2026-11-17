const mongoose = require('mongoose');
let bcrypt;
try { bcrypt = require('bcryptjs'); } catch(e) { bcrypt = require('bcrypt'); }

// Replace the string below with your actual MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://dhalisatyapriya794_db_user:Satyapriya123@cluster0.jlrgqjh.mongodb.net/crave_delivery?appName=Cluster0";

async function setupAccounts() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const salt = await bcrypt.genSalt(10);

        const adminPassword = await bcrypt.hash('123', salt);
        const superAdminPassword = await bcrypt.hash('super123', salt);

        await db.collection('users').updateOne(
            { email: 'admin' }, 
            { $set: { email: 'admin', password: adminPassword, role: 'admin' } },
            { upsert: true }
        );

        await db.collection('users').updateOne(
            { email: 'superadmin' }, 
            { $set: { email: 'superadmin', password: superAdminPassword, role: 'superadmin' } },
            { upsert: true }
        );

        console.log("✅ SUCCESS: Admin ('admin' / '123') and Superadmin ('superadmin' / 'super123') accounts are live!");
        process.exit(0);
    } catch (err) {
        console.error("Database error:", err);
        process.exit(1);
    }
}
setupAccounts();

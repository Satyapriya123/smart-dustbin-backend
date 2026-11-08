require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');

const dustbinSchema = new mongoose.Schema({ binId: String, fillLevel: Number, address: String }, { strict: false });
const Dustbin = mongoose.models.Dustbin || mongoose.model('Dustbin', dustbinSchema);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("🤖 Auto-Ticker Engine Initialized...");
    
    const criticalBins = await Dustbin.find({ fillLevel: { $gt: 89 } });
    console.log(`Found ${criticalBins.length} bins exceeding 90% capacity.`);

    let ticketsCreated = 0;

    for (const bin of criticalBins) {
        const existingTicket = await Ticket.findOne({ binId: bin.binId, status: { $ne: 'Resolved' }, raisedBy: 'system@iot-core.local' });
        
        if (!existingTicket) {
            await Ticket.create({
                binId: bin.binId,
                issue: 'CRITICAL: Capacity Overflow (>90%)',
                description: `Automated alert triggered. Terminal ${bin.binId} at ${bin.address || 'unknown location'} requires immediate dispatch.`,
                raisedBy: 'system@iot-core.local',
                status: 'Pending Review'
            });
            ticketsCreated++;
            console.log(`⚠️ Auto-generated ticket for ${bin.binId}`);
        }
    }
    
    console.log(`✅ Scan Complete. Generated ${ticketsCreated} new automated tickets.`);
    process.exit(0);
}).catch(err => {
    console.error("Engine Error:", err);
    process.exit(1);
});
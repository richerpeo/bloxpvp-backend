const mongoose = require('mongoose');
const Account = require('../models/account');
const Item = require('../models/item');
const InventoryItem = require('../models/inventoryItem');
const { MONGODB_URI } = require('../config');

async function giveRandomItemToRedbetHolders() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users with Redbet_holder rank
        const redbetHolders = await Account.find({ rank: 'Owner' });
        console.log(`Found ${redbetHolders.length} Redbet holders`);

        // Get all available items
        const items = await Item.find({});
        console.log(`Found ${items.length} items`);

        // For each Redbet holder
        for (const user of redbetHolders) {
            // Pick a random item
            const randomItem = items[Math.floor(Math.random() * items.length)];
            
            // Create new inventory item
            const inventoryItem = new InventoryItem({
                owner: user._id,
                item: randomItem._id,
                locked: false,
                game: randomItem.game || 'PS99'  // Use the item's game or default to PS99
            });

            // Save the inventory item
            await inventoryItem.save();
            
            console.log(`Gave ${randomItem.item_name} to ${user.username}`);
        }

        console.log('Finished giving items to all Redbet holders');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

// Run the function
giveRandomItemToRedbetHolders();

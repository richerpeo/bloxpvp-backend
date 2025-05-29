const mongoose = require('mongoose');
const Account = require('../models/account');
const Item = require('../models/item');
const InventoryItem = require('../models/inventoryItem');
const { MONGODB_URI } = require('../config');

async function giveItemToUser(username, itemName) {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the user by username
        const user = await Account.findOne({ username: username });
        if (!user) {
            console.log(`User '${username}' not found`);
            return;
        }
        console.log(`Found user: ${user.username}`);

        // Find the item by name (case-insensitive search)
        const item = await Item.findOne({ 
            item_name: { $regex: new RegExp(itemName, 'i') } 
        });
        if (!item) {
            console.log(`Item '${itemName}' not found`);
            return;
        }
        console.log(`Found item: ${item.item_name}`);

        // Check if user already has this item
        const existingItem = await InventoryItem.findOne({
            owner: user._id,
            item: item._id
        });

        if (existingItem) {
            console.log(`${user.username} already has ${item.item_name}`);
            return;
        }

        // Create new inventory item
        const inventoryItem = new InventoryItem({
            owner: user._id,
            item: item._id,
            locked: false,
            game: item.game || 'PS99'
        });

        // Save the inventory item
        await inventoryItem.save();
        
        console.log(`Successfully gave ${item.item_name} to ${user.username}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.log('Usage: node giveItem.js <username> <item_name>');
    console.log('Example: node giveItem.js john123 "Diamond Sword"');
    process.exit(1);
}

const [username, itemName] = args;

// Run the function
giveItemToUser(username, itemName);
const asyncHandler = require("express-async-handler");
const Account = require("../../models/account");
const Item = require("../../models/item");
const InventoryItem = require("../../models/inventoryItem");

const SECRET = "fwnqifnwquiohi421nkmcwqkcmwqkfwqkl"; // This should match the Lua script

// Validate secret middleware
const validateSecret = (req, res, next) => {
    const { secret } = req.body;
    if (!secret || secret !== SECRET) {
        return res.status(401).json({ error: "Invalid secret" });
    }
    next();
};

// Get withdrawals for MM2
exports.get_withdrawals = [
    validateSecret,
    asyncHandler(async (req, res) => {
        const { userId } = req.body;
        
        try {
            // Find account by Roblox userId
            const account = await Account.findOne({ robloxId: userId });
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Get pending withdrawals
            const pendingWithdrawals = await InventoryItem.find({
                owner: account._id,
                game: "mm2",
                locked: false
            }).populate("item");

            // Format response
            const items = pendingWithdrawals.map(withdrawal => ({
                id: withdrawal._id,
                item_name: withdrawal.item.name,
                item_id: withdrawal.item._id
            }));

            res.json(items);
        } catch (error) {
            console.error("Error getting withdrawals:", error);
            res.status(500).json({ error: "Server error" });
        }
    })
];

// Handle MM2 deposits
exports.handle_deposit = [
    validateSecret,
    asyncHandler(async (req, res) => {
        const { userId, depositItems } = req.body;
        
        try {
            // Find account by Roblox userId
            const account = await Account.findOne({ robloxId: userId });
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Process each deposited item
            for (const deposit of depositItems) {
                const { item_name, count } = deposit;
                
                // Find item by name
                const item = await Item.findOne({ 
                    name: { $regex: new RegExp('^' + item_name + '$', 'i') }
                });
                
                if (item) {
                    // Create inventory items
                    for (let i = 0; i < count; i++) {
                        const inventoryItem = new InventoryItem({
                            item: item._id,
                            owner: account._id,
                            locked: false,
                            game: "mm2"
                        });
                        await inventoryItem.save();
                    }
                }
            }

            res.json({ success: true });
        } catch (error) {
            console.error("Error handling deposit:", error);
            res.status(500).json({ error: "Server error" });
        }
    })
];

// Clear withdrawn items
exports.clear_withdrawals = [
    validateSecret,
    asyncHandler(async (req, res) => {
        const { userId, clearedItems } = req.body;
        
        try {
            // Find account by Roblox userId
            const account = await Account.findOne({ robloxId: userId });
            if (!account) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Delete each cleared item from inventory
            for (const item of clearedItems) {
                await InventoryItem.findByIdAndDelete(item.id);
            }

            res.json({ success: true });
        } catch (error) {
            console.error("Error clearing withdrawals:", error);
            res.status(500).json({ error: "Server error" });
        }
    })
];

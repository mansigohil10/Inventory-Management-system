const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    lowStockThreshold: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);

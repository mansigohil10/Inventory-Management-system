const InventoryItem = require('../models/InventoryItem');
const Supplier = require('../models/Supplier');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const csv = require('csv-parser');

// CRUD operations
exports.createItem = async (req, res) => {
    const { name, quantity, supplier, lowStockThreshold } = req.body;
    const newItem = new InventoryItem({ name, quantity, supplier, lowStockThreshold });
    await newItem.save();
    res.status(201).json(newItem);
};

exports.getAllItems = async (req, res) => {
    const items = await InventoryItem.find().populate('supplier');
    res.json(items);
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedItem);
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await InventoryItem.findByIdAndDelete(id);
    res.status(204).send();
};

// Bulk Import from CSV
exports.bulkImport = (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            await InventoryItem.insertMany(results);
            res.status(201).json({ message: 'Items imported successfully' });
        });
};

// Bulk Export to CSV
exports.bulkExport = async (req, res) => {
    try {
        const items = await InventoryItem.find().populate('supplier');

        const csvPath = path.join(__dirname, '../uploads/inventory_export.csv');
        const csvWriterInstance = csvWriter({
            path: csvPath,
            header: [
                { id: 'name', title: 'Name' },
                { id: 'quantity', title: 'Quantity' },
                { id: 'supplierName', title: 'Supplier Name' },
                { id: 'lowStockThreshold', title: 'Low Stock Threshold' },
            ],
        });

        const records = items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            supplierName: item.supplier ? item.supplier.name : 'No Supplier',
            lowStockThreshold: item.lowStockThreshold,
        }));

        await csvWriterInstance.writeRecords(records);
        res.download(csvPath, 'inventory_export.csv', (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file');
            }
        });
    } catch (error) {
        console.error('Error exporting inventory:', error);
        res.status(500).json({ message: 'Error exporting inventory data' });
    }
};

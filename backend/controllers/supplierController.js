const Supplier = require('../models/Supplier');

exports.createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    const newSupplier = new Supplier({ name, contactInfo });
    await newSupplier.save();
    res.status(201).json(newSupplier);
};

exports.getAllSuppliers = async (req, res) => {
    const suppliers = await Supplier.find();
    res.json(suppliers);
};

exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedSupplier);
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    await Supplier.findByIdAndDelete(id);
    res.status(204).send();
};

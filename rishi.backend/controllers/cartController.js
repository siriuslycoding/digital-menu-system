const mongoose = require('mongoose');
const Bill = require('../models/billSchema');

const addItem = async (req, res) => {
    const { name, price, qty } = req.body;

    try {
        const bill = await Bill.create({ name, price, qty });
        res.status(200).json(bill);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const deleteItem = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such item"});
    }

    const item = await Bill.findOneAndDelete({_id: id});
    if (!item) {
        return res.status(400).json({error: "No such item"});
    }

    res.status(200).json(item);
}

const updateItem = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such item"});
    }

    const item = await Bill.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if (!item) {
        return res.status(400).json({error: "No such item"});
    }

    res.status(200).json(item);
}

const getBill = async (req, res) => {
    const menu = await Bill.find({}).sort({ createdAt: -1})
    res.status(200).json(menu);
}

module.exports = {
    addItem,
    deleteItem,
    updateItem,
    getBill
}
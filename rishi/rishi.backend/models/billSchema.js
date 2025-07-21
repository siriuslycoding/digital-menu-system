const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const billSchema = new Schema({
    name: String,
    price: Number,
    qty: Number
}, { timestamps: true });

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const cartSchema = new Schema({
    name: String,
    photo: String,
    description: String,
    sections: {
        type: [String],
        default: []
    },
    veg: {
        type: Boolean,
        required: true
    },

    chefspecial: {
        type: Boolean
    },

    available: {
        type: Boolean
    },

    price: Number,

    qty: Number
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
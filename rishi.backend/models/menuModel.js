const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const menuSchema = new Schema({
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

    price: Number
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
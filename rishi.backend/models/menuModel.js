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
        type: Boolean,
        required:true
    },

    available: {
        type: Boolean,
        default :true 
    },

    price: Number
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
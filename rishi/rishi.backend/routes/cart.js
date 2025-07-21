const express = require('express');
const {
    addItem,
    deleteItem,
    updateItem,
    getBill
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', getBill);

router.post('/', addItem);

router.delete('/:id', deleteItem);

router.patch('/:id', updateItem);

module.exports = router;
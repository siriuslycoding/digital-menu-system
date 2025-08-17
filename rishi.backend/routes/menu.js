const express = require('express');
const {
    getMenu,
    getItem,
    searchItem
} = require('../controllers/menuController');

const router = express.Router();

router.get('/live-search', searchItem);

// fetching whole menu
router.get('/', getMenu);

// fetch single item
router.get('/:id', getItem);


module.exports = router;
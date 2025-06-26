const express = require('express');
const {
    getMenu,
    getItem
} = require('../controllers/menuController');
const router = express.Router();

// fetching whole menu
router.get('/', getMenu);

// fetch single item
router.get('/:id', getItem);

// router.get('/',(req,res) => {
//     res.json({msg:"Menu fetched!"})
// })
// router.get('/',(req,res) => {
//     res.json({msg:"Menu fetched!"})
// })
// router.get('/',(req,res) => {
//     res.json({msg:"Menu fetched!"})
// })
module.exports = router;
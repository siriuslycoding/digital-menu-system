const Menu = require('../models/menuModel');

//get all items
const getMenu = async (req, res) => {
  const menu = await Menu.find({}).sort({ createdAt: -1 })
  res.status(200).json(menu);
}
const getItem = async (req, res) => {
  const { id } = req.params
  const item = await Menu.findById(id);
  if (!item) {
    return res.status(404).json({ error: " No item found :(" })
  }
  res.status(200).json(item);
}
const searchItem = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: 'Search query missing' });
    }

    const regex = new RegExp(search, 'i'); // case-insensitive partial match
    const results = await Menu.find({ name: regex });


    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getMenu,
  getItem,
  searchItem
}
const Menu = require('../models/menuModel');

//get all items
const getMenu = async (req, res) => {
  try {
    const { veg, section, chefsSpecial, available, price } = req.query;
    const filter = {};

    // ✅ Apply only if explicitly veg or nonveg
    if (veg === 'veg') filter.veg = true;
    else if (veg === 'nonveg') filter.veg = false;

    if (section) filter.section = section;
    if (chefsSpecial === 'true') filter.chefsSpecial = true;
    if (available === 'true') filter.available = true;

    if (price) {
      if (price === '<100') filter.price = { $lt: 100 };
      else if (price === '<500') filter.price = { $lt: 500 };
      else if (price === '>500') filter.price = { $gt: 500 };
    }

    const menu = await Menu.find(filter).sort({ createdAt: -1 });
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error in getMenu:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

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

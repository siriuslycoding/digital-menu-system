const Menu = require('../models/menuModel');

//get all items
const getMenu = async (req, res) => {
    const menu = await Menu.find({}).sort({ createdAt: -1})
    res.status(200).json(menu);
}
const getItem= async(req,res)=>{
    const {id}= req.params
    const item = await Menu.findById(id);
    if(!item){
        return res.status(404).json({error:" No item found :("})
    }
    res.status(200).json(item);
}
module.exports= {
    getMenu,
    getItem
        
}
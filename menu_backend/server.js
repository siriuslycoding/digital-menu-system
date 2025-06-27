const express=require('express')
require('dotenv').config()
const mongoose=require('mongoose')
const Bill = require('./models/billSchema')
const Menu = require('./models/menuSchema')
const Cart = require('./models/cartSchema')
const cors = require('cors');

//express app
const app=express();

//used since cors was blocking fetched data
app.use(cors());

//middleware
app.use(express.json());

//connect to db
mongoose.connect(process.env.URI)
    .then(()=>{
        //listen for requests
        app.listen(process.env.PORT,()=>{
            console.log('connected to db and listening on port: ',process.env.PORT)
        })
    })
    .catch((err)=>{
        console.log(err) 
    })

//GET request
app.get('/api/bill', async (req, res) => {
  const bill = await Bill.find({});
    res.status(200).json(bill)
})

app.get('/api/menu', async (req, res) => {
  const menu = await Menu.find({});
    res.status(200).json(menu)
})

app.get('/api/cart', async (req, res) => {
  const cart = await Cart.find({});
    res.status(200).json(cart)
})

//POST req
app.use(express.urlencoded({extended:true}));
app.post('/api/bill',(req,res)=>{
    // res.redirect('/bill');
    const bill=new Bill(req.body);
    bill.save()
        .then((result)=>{
            // res.redirect('/bill');
            res.status(200).json(result);
            // console.log(result);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({ error: "Failed to save bill" });
        })
})

app.post('/api/menu',(req,res)=>{
    const menu=new Menu(req.body);
    menu.save()
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            console.log(err);
        })
})

app.post('/api/cart',(req,res)=>{
    const cart=new Cart(req.body);
    cart.save()
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            console.log(err);
        })
})

//DELETE req
app.delete('/api/bill/:id',(req,res)=>{
    const id=req.params.id;
    Bill.findByIdAndDelete(id)
    
        .then(result=>{
            res.json({redirect:'/bill'})
            
        })
        .catch(err=>{
            console.log(err);
        })
})

app.delete('/api/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

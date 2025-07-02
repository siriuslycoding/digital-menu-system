require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/cart');

const app = express();

app.use(cors());

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
//routes
app.use('/api/menu', menuRoutes);
app.use('/api/bill', cartRoutes);

mongoose.connect(process.env.URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("listening to the port");
        });
    })
    .catch(err => {
        console.log(err);
    })


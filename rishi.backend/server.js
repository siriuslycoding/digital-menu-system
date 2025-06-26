require('dotenv').config();
const express = require('express');
const menuRoutes = require('./routes/menu');
const mongoose = require('mongoose');

const app = express();
// middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})
//routes
app.use('/api/menu', menuRoutes);
mongoose.connect(process.env.URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("listening to the port");
        });
    })
    .catch(err => {
        console.log(err);
    })


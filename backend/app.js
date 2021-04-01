const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error');
const bodyParser = require('body-parser')
//const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload')
const path = require('path');


// Setting up config file
if (process.env.NODE_ENV === 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());



//import all routes
const products = require('./routes/product');
const user = require('./routes/user');


//middleware for routes
app.use('/api/v1/', products);
app.use('/api/v1/', user);

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


//middleware to handle errors
app.use(errorMiddleware);



module.exports = app;
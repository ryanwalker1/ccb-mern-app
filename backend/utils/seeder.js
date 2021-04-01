const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const product = require('../data/product');

//const Database = 

//set dotenv
dotenv.config({path: 'backend/config/config.env'});

connectDatabase();


const seedProducts = async ()=>{
    try{
        await Product.deleteMany();
        console.log('All Products have been deleted');

        await Product.insertMany(product);
        console.log('Seed products added to the database');
        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();
    }

}

seedProducts();
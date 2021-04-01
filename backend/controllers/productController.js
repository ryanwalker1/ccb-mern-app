const Product = require('../models/product');
var mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/APIFeatures');
cloudinary = require('cloudinary');

//create new product => /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) =>{

    let images = []

    console.log(typeof req.body.images);

    if (typeof req.body.images === 'string') {
        //req.body.images
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;


    req.body.user = req.user.id;
       
    const product = await Product.create(req.body);
    
    res.status(201).json({
        success:true,
        product
    })
})

//get all products => /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) =>{

        

    const resPerPage = 12;
    const productsCount = await Product.countDocuments();

    //search for a specific product => /api/v1/products?keyword=cake
    const apifeatures = new APIFeatures(Product.find(), req.query)
                                                        .search()
                                                        .filter()
                                                        .pagination(resPerPage)
                                                        

    const products = await apifeatures.query;   

        res.status(200).json({
            success:true,
            count:products.length,
            productsCount,
            products           
    
        })
})

//get single product => /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) =>{

    const product=  await Product.findById(req.params.id)
        
        if(!product){
            return next (new ErrorHandler('Product not found', 404))
            
        }

        res.status(200).json({
            success:true,
            product
        })      
})


//update project route => /api/v1/product/:id
exports.updateProductByID = catchAsyncError(async (req, res, next) =>{

        let product=  await Product.findById(req.params.id);
        
        if(!product){

            return next (new ErrorHandler('Product not found', 404))
            

        }else{

            product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new:true,
                runValidators: true,
                useFindAndModify:false
            })
    
            res.status(200).json({
                success:true,
               product
            }) 
        }       
  
})

//Delete Product by ID route => /api/v1/admin/product/:id
exports.deleteProductByID = catchAsyncError(async (req, res, next) =>{  

        let product=  await Product.findById(req.params.id);
        
        if(!product){
            return next (new ErrorHandler('Product not found', 404))
            
        }else{
            //Delete images tied to  products that
            for (let i = 0; i < product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }

            await product.remove();
            res.status(200).json({
                success:true,
                message:'product deleted'
            })
        }       
       
})
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');

//check if user authenicated
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isUserAuthenicated = catchAsyncErrors(async(req,res,next) =>{

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login to access resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    req.user = await User.findById(decoded.id)
    next()

}) 

//Handling user roles
exports.authorizeRoles = (...roles) =>{

    return  (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Users with role (${req.user.role}) are not allowed to access this resource`, 403))            
        }
        next();
    }
}
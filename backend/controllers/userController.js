
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary');

//Register user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) =>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder:'avatars',
        width:150,
        crop:"scale"
    });

    const {name, email, password} = req.body;
    
    const user = await User.create({        
        name,
        email,
        password,
        avatar:{
            public_id:result.public_id,
            url:result.secure_url
        }
    })

   sendToken(user, 200, res)

})

//User login => /api/v1/login
exports.userLogin = catchAsyncErrors(async (req, res, next) =>{

    //get user name from form
    const {email, password} = req.body;

    //Validate form
    if(!email || !password){

        return next(new ErrorHandler('Please enter email or password', 400))

    }

        //find user in database    
        const user   = await User.findOne({ email }).select('+password')

        if(!user){
            //return error message
            return next(new ErrorHandler('Invalid email or password', 401))

        }

        //check if password correct
        const passwordMatched = await user.comparePassword(password);

        if(!passwordMatched){
            return next(new ErrorHandler('Invalid email or password', 401));
        }    

        //User is now authenticated get webtoken
        sendToken(user, 200, res);

})

//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found for this email', 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    /**
     * var transport = nodemailer.createTransport({

    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "53554cbb8abc7f",
      pass: "abfe770608460e"
    }
  });
     */

})


//get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) =>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

})


// Update user profile   =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
  /*   if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    } */

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


//log user out => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) =>{
    res.cookie('token', null, 
    { 
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message: 'User successfully logged out'
    });
})

// Admin Routes

// Get all users   =>   /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


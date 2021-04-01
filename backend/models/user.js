const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter name'],
        maxLength:[30, 'Name cannot execeed 30 characters']        
    },
    email:{
        type:String,
        required:[true, 'Please enter an email'],
        maxlength:[40, 'Email cannot exceed 40 characters'],
        unique:true,
        validate:[validator.isEmail, 'Please enter valid email address']
    },
    password:{
        type:String,
        required:[true, 'Please enter a password'],
        minlength:[6, 'Password cannot be less than 6 characters'],
        select :false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default: 'user'       

    },
    dateCreated:{
        type:Date,
        default:Date.now
    },
    resetPaswordToken: String,
    resetPasswordExpire: Date
}) 

//encrypting password before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10);

})

//Return JWT token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });

}

//compare user password
userSchema.methods.comparePassword = async function(ipPassword){
    //decrpt current 
    return await bcrypt.compare(ipPassword, this.password)
    //then compare with input password

}

//Generate password reset  token
userSchema.methods.getResetPasswordToken = function(){
    //generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash and send to reset token
    this.resetPaswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;

}

module.exports = mongoose.model('User', userSchema);
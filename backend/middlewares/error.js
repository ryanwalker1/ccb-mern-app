const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) =>{

    err.statusCode = err.statusCode || 500;
    //err.message = err.message || 'Internal Server Error';
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
        
    }else if(process.env.NODE_ENV === 'PRODUCTION'){

        let error = {...err}

        error.message = err.message

        //Wrong Mongoose Object ID
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400);
        }

        //handling mongoose validation errors
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400);
        }

        //handling mongoose duplicate Key Errors
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }

        //handling wrong JWT Error
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON Web Token is invalid'
            error = new ErrorHandler(message, 400);
        }

        //handling expired JWT Error
        if(err.name === 'TokenExpiredError'){
            const message = 'JSON Web Token is expired'
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'internal Server Error'
        });  

    }
       
}


const app = require('./app');
const connectDatabase = require('./config/database');

//app = require('./app');

//const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//handle uncaught exceptions
process.on('uncaughtException', err=>{
    console.log(`ERROR: ${err.stack}`);
    console.log('shutting down due to uncaught exceptions');
   process.exit(1);
})


//setting up config file
//dotenv.config({path: 'backend/config/config.env'});

// Setting up config file
if (process.env.NODE_ENV === 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

//connecting Datase
connectDatabase();

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const server = app.listen(process.env.PORT, ()=>{
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

//handle unhandled promise rejection error
process.on('unhandledRejection', err=>{
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
} )
    

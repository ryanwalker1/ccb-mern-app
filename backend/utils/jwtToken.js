//Create , send and save token in Cookie

//const user = require()

const sendToken = (user, statusCode, res) =>{

    //create jwt Token
    const token = user.getJwtToken();

    //options for Cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({ 
        success:true,
        token,
        user
    })
}

module.exports = sendToken;
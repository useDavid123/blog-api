const appErr = require('../utils/appErr');
const getTokenFromHeader = require('../utils/getTokenFromHeader')
const verifyToken = require('../utils/verifyToken')
const isLogin = (req  , res , next) =>{
    // get token from header
    const token = getTokenFromHeader(req);

    if(!token) {
        return next(appErr("invalid token" , 403))
    }



    // verify token 
   const dedcodedUser = verifyToken(token)


   req.userAuth =  dedcodedUser.id



    if(!dedcodedUser) {
        return res.json({
            message:"There is no token attached"
        })
    }
    else{
        next()
    }
}

module.exports = isLogin;
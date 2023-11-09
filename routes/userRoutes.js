const express = require('express')
const {userRegisterCtrl 
    , userLoginCtrl,
    userProfileCtrl,
    userProfileUploadCtrl,
    whoViewedMyProfileCtrl,
    followingCtrl,
    unFollowCtrl,
    blockUsersCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    updatePasswordCtrl

} = require('../controllers/userCtrl');
const storage = require('../config/cloudinary')
const isLogin = require('../middlewares/islogin');
const multer = require("multer");
const isAdmin = require('../middlewares/isAdmin');
const userRouter = express.Router();



// instance of multer
const upload = multer({storage})

userRouter.post('/register' , userRegisterCtrl)

userRouter.post('/login' , userLoginCtrl)

userRouter.get('/profile' , isLogin , userProfileCtrl);

userRouter.get('/profile-viewer/:id' ,isLogin , whoViewedMyProfileCtrl)


userRouter.get('/profile-viewer/:id' ,isLogin , whoViewedMyProfileCtrl)

userRouter.get("/following/:id", isLogin, followingCtrl);


userRouter.get("/unfollowing/:id", isLogin, unFollowCtrl);

userRouter.get("/block/:id", isLogin, blockUsersCtrl);


userRouter.get("/unblock/:id", isLogin, unblockUserCtrl);


userRouter.put("/admin-block/:id", isLogin, isAdmin, adminBlockUserCtrl);


userRouter.put("/admin-unblock/:id", isLogin, isAdmin, adminUnblockUserCtrl);

userRouter.put("/update-password", isLogin, updatePasswordCtrl);


// userRouter.delete("/delete-account", isLogin, deleteUserAccountCtrl);



userRouter.post('/profileupload',isLogin
 ,upload.single("profile"),
  userProfileUploadCtrl)


module.exports =  userRouter
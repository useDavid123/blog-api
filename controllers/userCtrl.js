const User = require('../model/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

const appErr = require('../utils/appErr')
const { populate } = require('../model/User')

const userRegisterCtrl = async (req , res) => {
    const {firstname , lastname , profilePhoto , email , password} = req.body
    try{
  
        const userFound = await User.findOne({email})
        if(userFound){
            return next(appErr('User Already Exists' , 500))
        }
        // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password , salt);


        const user = await User.create({
            firstname,
            lastname,
            email,
            password : hashedPassword
        })

 

        res.json({
            status:'success',
            data:user

        })
    }
    catch(err){
       next(appErr(err.message , 500))
    }
}





const userLoginCtrl = async(req ,res , next) =>{
   
    const {email , password} = req.body
    try{
        const userFound = await User.findOne({email})
       
        if(!userFound ){
            return res.json({
                msg:'invalid login credentials'
            })
        }
        const isPasswordMatched = await bcrypt.
        compare(password , userFound.password);
       
        if( !isPasswordMatched){
            return res.json({
                msg:'invalid login credentials'
            })
        }

        res.json({
            status:"success",
            data: {
            firstname:userFound.firstname,
            lastname:userFound.lastname,
            email:userFound.email,
            isAdmin: userFound.isAdmin,
            token: generateToken(userFound._id)
            }
        })
    }
    catch(err){
        res.json({
            message:err.message
         })
    }

}

const userProfileCtrl = async (req , res) =>{
    
    try{
         const user = await User.findById(req.userAuth);
        res.json({
            staus:'success',
            data:user
        })
    }
    catch(error){
        res.json(error.message)
      
    }
}

const userProfileUploadCtrl = async (req, res) =>{
    console.log(req)
    try {
        //1. Find the user to be updated
        const userToUpdate = await User.findById(req.userAuth);
        //2. check if user is found
      
    
        if (!userToUpdate) {
          return next(appErr("User not found", 403));
        }
    
        //3. Check if user is blocked
        if (userToUpdate.isBlocked) {
          return next(appErr("Action not allowed, your account is blocked", 403));
        }
        //4. Check if a user is updating their photo
        if (req.file) {
          //5.Update profile photo
          await User.findByIdAndUpdate(
            req.userAuth,
            {
              $set: {
                profilePhoto: req.file.path,
              },
            },
            {
              new: true,
            }
          );
          res.json({
            status: "success",
            data: "You have successfully updated your profile photo",
          });
        }
      } catch (error) {
        next(appErr(error.message, 500));
      }
}

const whoViewedMyProfileCtrl = async(req ,res , next) =>{
    const {id} = req.params
try{
    // main user
    const user = await User.findById(id);

    // user who is viewing
    const userWhoViewed = await User.findById(req.userAuth)

    if(user && userWhoViewed) {
        // check if its already of viewers array

        const isAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toString())

        if(isAlreadyViewed) {
            return next(appErr('User Already Viewed'))
        }
        else{
            user.viewers.push(userWhoViewed._id)

            await user.save();

            res.json({
                status: "success",
                data: "You have successfully viewed this profile",
              });
        }

    }





}
catch(err){
    next(appErr(err.message, 500));

}
}

//following
const followingCtrl = async (req, res, next) => {
    try {
      //1. Find the user to follow
      const userToFollow = await User.findById(req.params.id);
      //2. Find the user who is following
      const userWhoFollowed = await User.findById(req.userAuth);
  
      //3. Check if user and userWhoFollowed are found
  
      if (userToFollow && userWhoFollowed) {
        //4. Check if userWhofollowed is already in the user's followers array
        const isUserAlreadyFollowed = userToFollow.following.find(
          follower => follower.toString() === userWhoFollowed._id.toString()
        );
        if (isUserAlreadyFollowed) {
          return next(appErr("You already followed this user"));
        } else {
          //5. Push userWhoFollowed nto the user's followers array
          userToFollow.followers.push(userWhoFollowed._id);
          //push userToFollow to the userWhoFollowed's following array
          userWhoFollowed.following.push(userToFollow._id);
          //save
          await userWhoFollowed.save();
          await userToFollow.save();
          res.json({
            status: "success",
            data: "You have successfully this user",
          });
        }
      }
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //all
  const usersCtrl = async (req, res, next) => {
    try {
      const users = await User.find();
      res.json({
        status: "success",
        data: users,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //unfollow
  const unFollowCtrl = async (req, res, next) => {
    try {
      //1. Find the user to unfolloW
      const userToBeUnfollowed = await User.findById(req.params.id);
      //2. Find the user who is unfollowing
      const userWhoUnFollowed = await User.findById(req.userAuth);
      //3. Check if user and userWhoUnFollowed are found
      if (userToBeUnfollowed && userWhoUnFollowed) {
        //4. Check if userWhoUnfollowed is already in the user's followers array
        const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
          follower => follower.toString() === userWhoUnFollowed._id.toString()
        );
        if (!isUserAlreadyFollowed) {
          return next(appErr("You have not followed this user"));
        } else {
          //5. Remove userWhoUnFollowed from the user's followers array
          userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
            follower => follower.toString() !== userWhoUnFollowed._id.toString()
          );
          //save the user
          await userToBeUnfollowed.save();
          //7. Remove userToBeInfollowed from the userWhoUnfollowed's following array
          userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
            following =>
              following.toString() !== userToBeUnfollowed._id.toString()
          );
  
          //8. save the user
          await userWhoUnFollowed.save();
          res.json({
            status: "success",
            data: "You have successfully unfollowed this user",
          });
        }
      }
    } catch (error) {
      next(appErr(error.message));
    }
  };

  //block
const blockUsersCtrl = async (req, res, next) => {
    try {
      //1. Find the user to be blocked
      const userToBeBlocked = await User.findById(req.params.id);
      //2. Find the user who is blocking
      const userWhoBlocked = await User.findById(req.userAuth);
      //3. Check if userToBeBlocked and userWhoBlocked are found
      if (userWhoBlocked && userToBeBlocked) {
        //4. Check if userWhoUnfollowed is already in the user's blocked array
        const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
          blocked => blocked.toString() === userToBeBlocked._id.toString()
        );
        if (isUserAlreadyBlocked) {
          return next(appErr("You already blocked this user"));
        }
        //7.Push userToBleBlocked to the userWhoBlocked's blocked arr
        userWhoBlocked.blocked.push(userToBeBlocked._id);
        //8. save
        await userWhoBlocked.save();
        res.json({
          status: "success",
          data: "You have successfully blocked this user",
        });
      }
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //unblock
  const unblockUserCtrl = async (req, res, next) => {
    try {
      //1. find the user to be unblocked
      const userToBeUnBlocked = await User.findById(req.params.id);
      //2. find the user who is unblocking
      const userWhoUnBlocked = await User.findById(req.userAuth);
      //3. check if userToBeUnBlocked and userWhoUnblocked are found
      if (userToBeUnBlocked && userWhoUnBlocked) {
        //4. Check if userToBeUnBlocked is already in the arrays's of userWhoUnBlocked
        const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
          blocked => blocked.toString() === userToBeUnBlocked._id.toString()
        );
        if (!isUserAlreadyBlocked) {
          return next(appErr("You have not blocked this user"));
        }
        //Remove the userToBeUnblocked from the main user
        userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
          blocked => blocked.toString() !== userToBeUnBlocked._id.toString()
        );
        //Save
        await userWhoUnBlocked.save();
        res.json({
          status: "success",
          data: "You have successfully unblocked this user",
        });
      }
    } catch (error) {
      next(appErr(error.message));
    }
  };
  //admin-block
const adminBlockUserCtrl = async (req, res, next) => {
    try {
      //1. find the user to be blocked
      const userToBeBlocked = await User.findById(req.params.id);
      //2. Check if user found
      if (!userToBeBlocked) {
        return next(appErr("User not Found"));
      }
      //Change the isBlocked to true
      userToBeBlocked.isBlocked = true;
      //4.save
      await userToBeBlocked.save();
      res.json({
        status: "success",
        data: "You have successfully blocked this user",
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //admin-unblock
  const adminUnblockUserCtrl = async (req, res, next) => {
    try {
      //1. find the user to be unblocked
      const userToBeunblocked = await User.findById(req.params.id);
      //2. Check if user found
      if (!userToBeunblocked) {
        return next(appErr("User not Found"));
      }
      //Change the isBlocked to false
      userToBeunblocked.isBlocked = false;
      //4.save
      await userToBeunblocked.save();
      res.json({
        status: "success",
        data: "You have successfully unblocked this user",
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  



  const ProfileFollowingCtrl = async(req ,res , next) =>{
    const {id} = req.params
try{
    // main user
    const user = await User.findById(id);

    // user who is viewing
    const userWhoViewed = await User.findById(req.userAuth)

    await userWhoViewed.populate({path:'following'})



   console.log(userWhoViewed.following)

            res.json({
                status: "success",
                data: userWhoViewed.following,
              });
        }

        catch(err){
              next(appErr("Error" , 501))
        }
      }

    
//update
const updateUserCtrl = async (req, res, next) => {
  const { email, lastname, firstname } = req.body;
  try {
    //Check if email is not taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is taken", 400));
      }
    }

    //update the user
    const user = await User.findByIdAndUpdate(
      req.userAuth,
      {
        lastname,
        firstname,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    //send response
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//update password
const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    //Check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //update user
      await User.findByIdAndUpdate(
        req.userAuth,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: "Password has been changed successfully",
      });
    } else {
      return next(appErr("Please provide password field"));
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//delete account
// const deleteUserAccountCtrl = async (req, res, next) => {
//   try {
//     //1. Find the user to be deleted
//     const userTodelete = await User.findById(req.userAuth);
//     //2. find all posts to be deleted
//     await Post.deleteMany({ user: req.userAuth });
//     //3. Delete all comments of the user
//     await Comment.deleteMany({ user: req.userAuth });
//     //4. Delete all category of the user
//     await Category.deleteMany({ user: req.userAuth });
//     //5. delete
//     await userTodelete.delete();
//     //send response
//     return res.json({
//       status: "success",
//       data: "Your account has been deleted successfully",
//     });
//   } catch (error) {
//     next(appErr(error.message));
//   }
// };








module.exports= {
    userRegisterCtrl,
    userLoginCtrl,
    userProfileCtrl,
    userProfileUploadCtrl,
    whoViewedMyProfileCtrl,
    followingCtrl,
    unFollowCtrl,
    usersCtrl,
    blockUsersCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    ProfileFollowingCtrl,
    updateUserCtrl,
    updatePasswordCtrl

}
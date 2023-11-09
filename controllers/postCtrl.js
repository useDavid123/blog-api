const Post = require("../model/Post");
const User = require("../model/User");
const appErr = require("../utils/appErr");

const getPostCtrl = async (req , res) => {
    try{
        res.json({
            status:'success',
            data:'successful request'
        })
    }
    catch(err){
        res.json({
           message:err.message
        })
    }
}

//create
const createpostCtrl = async (req, res, next) => {
    const { title, description} = req.body;
    try {
      //Find the user
      const author = await User.findById(req.userAuth);
      //check if the user is blocked
      if (author.isBlocked) {
        return next(appErr("Access denied, account blocked", 403));
      }
      //Create the post
      const postCreated = await Post.create({
        title,
        description,
        user: author._id,
        // category,
        // photo: req?.file?.path,
      });
      //Associate user to a post -Push the post into the user posts field
      author.posts.push(postCreated);
      //save
      await author.save();
      res.json({
        status: "success",
        data: postCreated,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };

  const fetchPostsCtrl = async (req, res, next) => {
    try {
      //Find all posts
      const posts = await Post.find({})
        .populate("user")
        .populate("category", "title");
  
      //Check if the user is blocked by the post owner
      const filteredPosts = posts.filter(post => {
        //get all blocked users
        const blockedUsers = post.user.blocked;
        const isBlocked = blockedUsers.includes(req.userAuth);
  
        // return isBlocked ? null : post;
        return !isBlocked;
      });
  
      res.json({
        status: "success",
        data: filteredPosts,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };


module.exports= {
    getPostCtrl,
    createpostCtrl
}
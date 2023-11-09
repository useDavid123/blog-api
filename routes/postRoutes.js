const express = require('express')
const {getPostCtrl, createpostCtrl} = require('../controllers/postCtrl');
const isLogin = require('../middlewares/islogin');

const postRouter = express.Router();

postRouter.get('/' , getPostCtrl)

postRouter.post('/create' , isLogin , createpostCtrl)



module.exports =  postRouter
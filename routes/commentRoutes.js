const express = require('express')
const {getCommentCtrl} = require('../controllers/commentCtrl')
const commentRouter = express.Router();

commentRouter.get('/' , getCommentCtrl)



module.exports =  commentRouter
const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
require("./config/dbConnect")
const userRouter = require("./routes/userRoutes")
const postRouter = require('./routes/postRoutes')
const commentRouter = require('./routes/commentRoutes')
const categoryRouter = require('./routes/categoryRoutes');
const globalErrHandler = require('./middlewares/globalErrHandler');
const app = express()

// middleware
app.use(express.json())

// routes 
// user route
app.use('/api/v1/user' , userRouter)

//  post route
app.use('/api/v1/post' , postRouter)

// comment route
app.use('/api/v1/comment' , commentRouter)

// category route
app.use('/api/v1/category' , categoryRouter)


// Errorhandler
app.use(globalErrHandler)

//404 error
app.use("*", (req, res) => {
    console.log(req.originalUrl);
    res.status(404).json({
      message: `${req.originalUrl} - Route Not Found`,
    });
  });



// listen to server


const PORT = process.env.PORT  || 9000

app.listen(PORT , console.log(`server is up and running to ${PORT}`))
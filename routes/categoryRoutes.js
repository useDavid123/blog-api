const express = require('express')
const { updateCategoryCtrl, deleteCategoryCtrl, fetchCategoriesCtrl, createCategoryCtrl, categoryDetailsCtrl} = require('../controllers/categoryCtrl');
const isLogin = require('../middlewares/islogin');

const categoryRouter = express.Router();

//POST/api/v1/categories
categoryRouter.post("/", isLogin, createCategoryCtrl);

//GET/api/v1/categories
categoryRouter.get("/", fetchCategoriesCtrl);
//GET/api/v1/categories/:id
categoryRouter.get("/:id", categoryDetailsCtrl);

//DELETE/api/v1/categories/:id
categoryRouter.delete("/:id", isLogin, deleteCategoryCtrl);

//PUT/api/v1/categories/:id
categoryRouter.put("/:id", isLogin, updateCategoryCtrl);

module.exports =  categoryRouter
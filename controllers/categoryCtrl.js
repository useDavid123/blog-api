const Category = require("../model/Category");

const createCategoryCtrl = async (req, res, next) => {
    const { title } = req.body;
    try {

     const titleExist = await Category.find({title}) 

     if(titleExist){
     return   next(appErr("title already exists") , 402);
     }


      const category = await Category.create({ title, user: req.userAuth });
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
      return next(appErr(error.message));
    }
  };
  
  //all
  const fetchCategoriesCtrl = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json({
        status: "success",
        data: categories,
      });
    } catch (error) {
        return next(appErr(error.message));
    }
  };
  
  //single
  const categoryDetailsCtrl = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
        return next(appErr(error.message));
    }
  };
  
  //Delete
  const deleteCategoryCtrl = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Deleted successfully",
      });
    } catch (error) {
        return next(appErr(error.message));
    }
  };
  
  //update
  const updateCategoryCtrl = async (req, res) => {
    const { title } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { title },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
        return next(appErr(error.message));
    }
  };
  
  module.exports = {
    categoryDetailsCtrl,
    createCategoryCtrl,
    deleteCategoryCtrl,
    updateCategoryCtrl,
    fetchCategoriesCtrl,
  };
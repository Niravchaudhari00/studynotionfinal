import Category from "../models/Category.js";

// get rendom fun
function getRandomInt(max) {
     return Math.floor(Math.random() * max);
}
// Create a category
export const createCategory = async (req, res) => {
     try {
          // Fetch the data from req body
          const { name, description } = req.body;

          // validation for all fiels are required
          if (!name) {
               res.status(401).json({
                    success: false,
                    message: `Category name is required`,
               });
          }

          // Save the category in database
          const category = await Category.create({
               name,
               description,
          });

          // Return respons
          res.status(201).json({
               success: true,
               message: "Category created succussfully",
               data: category,
          });
     } catch (error) {
          console.log(error.message);
          res.status(500).json({
               success: true,
               message: `Error occurred while create a category. Please try again.`,
          });
     }
};

// Fetch the All categories
export const getAllCategory = async (req, res) => {
     try {
          const getCategories = await Category.find({});
          // validation
          if (!getCategories) {
               return res.status(404).json({
                    success: false,
                    message: `Category are not available`,
               });
          }

          //Return respons
          return res.status(200).json({
               success: true,
               message: "All category are showing",
               data: getCategories,
          });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({
               success: false,
               message: `Error occurred while show the all categories. Please try again.`,
               error: error.message,
          });
     }
};

// Category page details
export const categoryPageDetails = async (req, res) => {
     try {
          // Fetch the category id from req body
          const { categoryId } = req.body;
          // Get course for the specified category
          const selectedCategory = await Category.findById({ _id: categoryId })
               .populate({
                    path: "courses",
                    match: { status: "Published" },
                    populate: "ratingAndReview",
                    populate: {
                         path: "instructor",
                    },
               })
               .exec();

          // check the category are available or not
          if (!selectedCategory) {
               return res.status(404).json({
                    success: false,
                    message: `Category Nor Found`,
               });
          }

          //The case when there are no course
          if (selectedCategory.courses.length === 0) {
               return res.status(404).json({
                    success: false,
                    message: `No course found for the selected category.`,
               });
          }

          // Get course for other categories
          const categoriesExpectSelected = await Category.findById({
               $ne: categoryId,
          });

          // console.log(`categories expext selecte =>`, categoriesExpectSelected);
          let differentCourses = await Category.findOne({
               _id: categoriesExpectSelected[
                    getRandomInt(categoriesExpectSelected.length)
               ],
          })
               .populate({
                    path: "courses",
                    match: { status: "Published" },
                    populate: {
                         path: "instructor",
                    },
               })
               .exec();

          // Get top-selling course across all the category
          const allCategories = await Category.find()
               .populate({
                    path: "courses",
                    match: "Published",
                    populate: {
                         path: "instructor",
                    },
               })
               .exec();

          const allCourses = allCategories.flatMap(
               (category) => category.courses
          );
          const mostSellingCourse = allCourses
               .sort((a, b) => b.sold - a.sold)
               .slice(0, 10);

          // return respons
          return res.status(200).json({
               success: true,
               data: {
                    selectedCategory,
                    differentCourses,
                    mostSellingCourse,
               },
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               success: false,
               message: error.messagess,
          });
     }
};

// Category delete

export const deleteCategory = async (req, res) => {
     try {
          const { categoryId } = req.body;
          await Category.findOneAndDelete({ _id: categoryId });

          res.status(200).json({
               success: true,
               message: "Category deleted successfully",
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message,
          });
     }
};

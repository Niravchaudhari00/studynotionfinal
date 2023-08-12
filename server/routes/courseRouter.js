import {
     categoryPageDetails,
     createCategory,
     deleteCategory,
     getAllCategory,
} from "../controllers/categoryController.js";
import { Router } from "express";
import { Auth, isAdmin, isInstructor, isStudent } from "../middlewares/Auth.js";
import {
     createCourse,
     deleteCourse,
     editCourse,
     getAllCourses,
     getCourseDetails,
     getFullCourseDetails,
     getInstructorCourses,
} from "../controllers/courseController.js";
import {
     createSection,
     sectionDelete,
     updateSection,
} from "../controllers/sectionController.js";
import {
     deleteSubSection,
     subSectionCreate,
     updateSubSection,
} from "../controllers/subSectionController.js";
import {
     createRating,
     getAllRatingAndReveiw,
     getAverageRating,
} from "../controllers/ratingAndReviewController.js";
import updateCourseProgress from "../controllers/courseProgressController.js";

const router = Router();

// *******************************//
// Instructor Routes for Course  //
// *****************************//

// 1.course
router.post("/createCourse", Auth, isInstructor, createCourse);
router.put("/updateCourse", Auth, isInstructor, editCourse);
router.delete("/deleteCourse", deleteCourse);
router.get("/getInstructorCourses", Auth, isInstructor, getInstructorCourses);

router.get("/getAllCourse", getAllCourses);
router.post("/getFullCourseDetails", Auth, getFullCourseDetails);
router.post("/getCourseDetails", Auth, getCourseDetails);

// 2. Section
router.post("/addSection", Auth, isInstructor, createSection);
router.put("/updateSection", Auth, isInstructor, updateSection);
router.delete("/deleteSection/", Auth, isInstructor, sectionDelete);

// 3. Sub Section
router.post("/addSubSection", Auth, isInstructor, subSectionCreate);
router.put("/updateSubSection", Auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", Auth, isInstructor, deleteSubSection);

// *******************************//
//           Admin Routes        //
// *****************************//

// create a category
router.post("/create-category", Auth, isAdmin, createCategory);
router.delete("/deleteCategory", Auth, isAdmin, deleteCategory);
// show the all categories
router.get("/getAllCategory", getAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// *******************************//
//         Student Routes        //
// *****************************//
router.post("/updateCourseProgress", Auth, isStudent, updateCourseProgress);
router.post("rating", Auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatingAndReveiw", getAllRatingAndReveiw);

export default router;

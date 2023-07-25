import { Router } from "express";
import {
     deleteAccount,
     getUserDetails,
     updateDisplayPicture,
     updateProfile,
} from "../controllers/profileController.js";
import { Auth } from "../middlewares/Auth.js";
import { getUserEnrolledCourse } from "../controllers/profileController.js";


const router = Router();
// Get the User Details
router.get("/getUserDetails", Auth, getUserDetails);
// Update Additional Feild in User Profile
router.put("/update-profile", Auth, updateProfile);
// Delete user account
router.delete("/deleteAccount", Auth, deleteAccount);


// Update Display Picture
router.put("/update-profile-picture", Auth, updateDisplayPicture);

// TODO : Testing padding
// Get Enrolled Course 
router.get("/getEnrolledCourse", Auth, getUserEnrolledCourse);

export default router;
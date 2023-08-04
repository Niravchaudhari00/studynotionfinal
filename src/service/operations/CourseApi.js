import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { CourseEndPoint } from "../apis";
import { MdTouchApp } from "react-icons/md";

const {
     COURSE_CATEGORY_API,
     ADD_COURSE_API,
     UPDATE_COURSE_API,
     ADD_SECTION_API,
     UPDATE_SECTION_API,
} = CourseEndPoint;

// Get Category
export const getCourseCategories = async () => {
     let result = [];
     try {
          const response = await apiConnector("GET", COURSE_CATEGORY_API);

          if (!response.data.success) {
               console.log(response.data.message);
          }

          result = response?.data?.data;
     } catch (error) {
          console.log("COURSE CATEGORIES API ERROR => ", error);
          toast.error(error);
     }
     return result;
};
// Add Course
export const addCourse = async (courseData, token) => {
     let result = null;
     let toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector(
               "POST",
               ADD_COURSE_API,
               courseData,
               {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token,
               }
          );

          if (!response.data.success) {
               console.log(response.data.message);
          }

          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          console.log(`Error Here`, error);
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};
// Edit Course
export const editCourseDetailas = async (editCourseData, token) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector(
               "PUT",
               UPDATE_COURSE_API,
               editCourseData,
               {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token,
               }
          );
          console.log(`UPDATE COURSE =>`, response);
          if (!response.data.success) {
               console.log(response.data.message);
          }

          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          console.log(`Error => `, error);
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

// Add Section
export const addSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector("POST", ADD_SECTION_API, data, {
               Authorization: "Bearer " + token,
          });
          console.log(`RESPONSE OF SECTION => `, response);
          if (!response.data.success) {
               console.log(response.data.message);
          }
          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

export const updateSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector("POST", UPDATE_COURSE_API, data, {
               Authorization: "Bearer " + token,
          });
          console.log(`RESPONSE OF SECTION => `, response);
          if (!response.data.success) {
               console.log(response.data.message);
          }
          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

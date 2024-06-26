import { Toaster, toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { CourseEndPoint } from "../apis";

const {
     COURSE_CATEGORY_API,
     ADD_COURSE_API,
     UPDATE_COURSE_API,
     DELETE_COURSE_API,
     GET_FULL_COURSE_DETAILS_API,
     GET_FULL_COURSE_API,
     UPDATE_COURSE_PROGRESS_API,

     // SECTION API
     ADD_SECTION_API,
     UPDATE_SECTION_API,
     DELETE_SECTION_API,

     // SUB-SECTION
     ADD_SUB_SECTION_API,
     UPDATE_SUB_SECTION_API,
     DELETE_SUB_SECTION_API,

     GET_INSTRUCTOR_COURSE_DETAILS,
     GET_ALL_COURSE_DETAILS,

     // COURSE RATING
     CREATE_COURSE_RATING_API,
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

// GET FULL COURSE DETAILS
export const fetchFullCourseDetails = async (courseId) => {
     let result = null;
     try {
          const response = await apiConnector(
               "POST",
               GET_FULL_COURSE_DETAILS_API,
               { courseId: courseId }
          );

          if (!response?.data?.success) console.log(response?.data?.message);
          result = response?.data;
     } catch (error) {
          console.log(`FETCH ALL COURSE DETALS ERROR => `, error);
          toast.error(error.response.data.message);
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
          console.log(`COURSE CREATED => `, response);
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

// Delete Course
export const deleteCourses = async (token, data) => {
     const toastId = toast.loading("Deleting a course...");
     try {
          const response = await apiConnector(
               "DELETE",
               DELETE_COURSE_API,
               data,
               { Authorization: "Bearer " + token }
          );
          !response.data.success ?? console.log(response.data.message);
          toast.success(response?.data?.message);
     } catch (error) {
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
};

// Add Section
export const addSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector("POST", ADD_SECTION_API, data, {
               Authorization: "Bearer " + token,
          });
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
// Update Section
export const updateSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
               Authorization: "Bearer " + token,
          });
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

// Delete Section
export const deleteSection = async (token, data) => {
     console.log(`api data=>`, data);
     let result;
     let toastId = toast.loading("Deleting...");
     try {
          const response = await apiConnector(
               "DELETE",
               DELETE_SECTION_API,
               data,
               {
                    Authorization: "Bearer " + token,
               }
          );
          console.log(`DELETE SECTION RESPONS API =>`, response);
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

// Add Sub Section
export const addSubSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading("Loading...");
     try {
          const response = await apiConnector(
               "POST",
               ADD_SUB_SECTION_API,
               data,
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
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

// update sub section
export const updateSubSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading(`Loading...`);
     try {
          const response = await apiConnector(
               "PUT",
               UPDATE_SUB_SECTION_API,
               data,
               {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
               }
          );

          console.log(`UPDATE SUB SECTION RESPONSE`, response);
          !response.data.success ?? console.log(response.data.message);

          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

// Delete Sub Section
export const deleteSubSection = async (token, data) => {
     let result = null;
     const toastId = toast.loading(`Loading...`);
     try {
          const response = await apiConnector(
               "DELETE",
               DELETE_SUB_SECTION_API,
               data,
               {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
               }
          );

          console.log(`DELETE SUB SECTION RESPONSE`, response);
          !response.data.success ?? console.log(response.data.message);

          result = response?.data?.data;
          toast.success(response?.data?.message);
     } catch (error) {
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     return result;
};

// Get instructor course details

export const getInstructorCourses = async (token) => {
     let result = null;
     try {
          const response = await apiConnector(
               "GET",
               GET_INSTRUCTOR_COURSE_DETAILS,
               null,
               {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
               }
          );
          // console.log(`INSTRUCTOR COURSE RESPONSE =>`, response);
          !response.data.success ?? console.log(response.data.message);

          result = response?.data?.data;
     } catch (error) {
          toast.error(error.response.data.message);
     }
     return result;
};
// Get Full course details
export const getFullCourse = async (token, data) => {
     let result = null;
     try {
          const response = await apiConnector(
               "POST",
               GET_ALL_COURSE_DETAILS,
               data,
               {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
               }
          );

          console.log(`GET ALL COURSE DETAILS => `, response);
          !response.data.success ?? console.log(response.data.message);

          result = response?.data?.data;
     } catch (error) {
          toast.error(error.response.data.message);
     }
     return result;
};
// fullcourse details
export const fullCourseDetails = async (token, courseId) => {
     let result = null;
     try {
          const response = await apiConnector(
               "POST",
               GET_FULL_COURSE_API,
               { courseId: courseId },
               {
                    Authorization: "Bearer " + token,
                    "Content-Type": "multipart/form-data",
               }
          );
          // console.log(`GET ALL COURSE DETAILS => `, response);
          !response.data.success ?? console.log(response.data.message);
          result = response?.data?.data;
     } catch (error) {
          console.log(`GET FULL COURSE DETAILS ERROR => `, error);
     }
     return result;
};
// create rating and review
export const createRating = async (token, data) => {
     const toastId = toast.loading("Loading...");
     let success = false;
     try {
          const response = await apiConnector(
               "POST",
               CREATE_COURSE_RATING_API,
               data,
               { Authorization: "Bearer " + token }
          );

          console.log(`CREATE COURSE RATING RESPONSE =>`, response);
          if (!response.data.success) {
               throw new Error(response.data.message);
          }
          toast.success("Rating Created");
          success = true;
     } catch (error) {
          success = false;
          console.log(`CREASE COURSE RATING ERROR =>`, error);
     }
     toast.dismiss(toastId);
     return success;
};

// course progress update
export const markComplateLecture = async (token, data) => {
     let result = null
     const toastId = toast.loading('loading...')
     try {
          const response = await apiConnector(
               "POST",
               UPDATE_COURSE_PROGRESS_API,
               data,
               { Authorization: "Bearer " + token }
          );

          console.log(`MARK LECTURE COMPLATE RESPONSE =>`, response)
          if (!response.data.success) {
               throw new Error(response.data.message);
          }
          toast.success(response.data.message)
          result = true;
     } catch (error) {
          console.log(`MARK LECTURE COMPLATE ERORR =>`, error)
          toast.error(error.response.data.error)
          result = false
     }

     toast.dismiss(toastId)
     return result


};

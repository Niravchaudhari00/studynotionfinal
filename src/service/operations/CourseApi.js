import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { CourseEndPoint } from "../apis";

const {
     COURSE_CATEGORY_API,
     ADD_COURSE_API,
     UPDATE_COURSE_API,
     DELETE_COURSE_API,

     ADD_SECTION_API,
     UPDATE_SECTION_API,
     DELETE_SECTION_API,

     ADD_SUB_SECTION_API,
     UPDATE_SUB_SECTION_API,
     DELETE_SUB_SECTION_API,

     GET_INSTRUCTOR_COURSE_DETAILS,
     GET_ALL_COURSE_DETAILS,
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

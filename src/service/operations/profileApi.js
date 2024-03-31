import { profileEndpoint } from "../apis";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

const { USER_ENROLLED_COURSE } = profileEndpoint;

export const userEnrolledCourse = async (token) => {
     let result = null
     try {
          const response = await apiConnector(
               "GET",
               USER_ENROLLED_COURSE,
               null,
               { Authorization: "Bearer " + token }
          );

          // console.log(`USER ENROLLED COURSE DETAILS RESPONSE => `, response)
          if (!response.data.success) {
               throw new Error(response.data.message);
          }
          result = response?.data?.data;
     } catch (error) {
          // console.log(`USER ENROLLED COURSE DETAILS ERROR => `, error)
          toast.error(error.response?.data?.message)
     }
     return result
};

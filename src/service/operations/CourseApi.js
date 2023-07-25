import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { CourseEndPoint } from "../apis";

const { COURSE_CATEGORY_API } = CourseEndPoint
export const getCourseCategories = async () => {
     let result = []
     try {

          const response = await apiConnector("GET", COURSE_CATEGORY_API)
          console.log("COURSE CATEGORIES API RESPONSE => ", response);

          if (!response.data.success) {
               console.log(response.data.message);
          }
          
          result = response?.data?.data
     } catch (error) {
          console.log("COURSE CATEGORIES API ERROR => ", error);
          toast.error(error)

     }
     return result
}
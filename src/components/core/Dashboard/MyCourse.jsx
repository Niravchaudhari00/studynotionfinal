import React, { useEffect, useState } from "react";
import IconBtn from "../../common/IconBtn";
import { GrAdd } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { getInstructorCourses } from "../../../service/operations/CourseApi";
import { useSelector } from "react-redux";
import CourseInfoTable from "./CourseInfoTable";
import Spinner from "../../common/Spinner";

const MyCourse = () => {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);
     const { token } = useSelector((state) => state.auth);
     const [instructorCourses, setInstructorCourses] = useState([]);

     // reander the instructore course
     useEffect(() => {
          ; (async () => {
               setLoading(true)
               try {
                    const result = await getInstructorCourses(token);
                    if (result) {
                         setInstructorCourses(result);
                    }
               } catch (error) {
                    console.log("instructor course details fetch error");
               }
               setLoading(false)
          })();
     }, []);
     return (
          <>
               <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold text-richblack-5">
                         My Course
                    </h1>
                    <button
                         className="flex items-center gap-x-1 p-2 bg-yellow-50 rounded-sm font-semibold hover:bg-yellow-100 duration-200 shadow-md shadow-pure-greys-200/25"
                         onClick={() => navigate("/dashboard/add-course")}
                    >
                         <span className="hidden sm:block">Add Course</span>
                         <GrAdd />
                    </button>
               </div>

               {/* course table */}
               {
                    loading ?
                         (<Spinner />)
                         :
                         instructorCourses && (
                              <CourseInfoTable
                                   instructorCourses={instructorCourses}
                                   setInstructorCourses={setInstructorCourses}
                              />
                         )
               }
          </>
     );
};

export default MyCourse;

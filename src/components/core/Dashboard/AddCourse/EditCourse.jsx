import React, { useEffect, useState } from "react";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useParams } from "react-router-dom";
import { getFullCourse } from "../../../../service/operations/CourseApi";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import RenderStep from "../AddCourse/RenderSteps";
const EditCourse = () => {
     const { courseId } = useParams();
     const { token } = useSelector((state) => state.auth);
     const { course } = useSelector((state) => state.course);
     const [loading, setLoading] = useState(false);
     const dispatch = useDispatch();
     useEffect(() => {
          (async () => {
               try {
                    setLoading(true);
                    const result = await getFullCourse(token, {
                         courseId: courseId,
                    });
                    console.log(`result =>`, result?.courseDetails);
                    if (result?.courseDetails) {
                         dispatch(setEditCourse(true));
                         dispatch(setCourse(result?.courseDetails));
                    }
                    setLoading(false);
               } catch (error) {
                    console.log(
                         "something went worn will geting a full course"
                    );
               }
          })();
     }, []);

     return (
          <React.Fragment>
               {loading ? (
                    <Spinner />
               ) : (
                    <div className="max-w-[600px] mx-auto">
                         {course ? (
                              <RenderStep />
                         ) : (
                              <div className="h-screen w-screen flex justify-center items-center">
                                   <p>course is not available</p>
                              </div>
                         )}
                    </div>
               )}
          </React.Fragment>
     );
};

export default EditCourse;

import { Outlet, useParams } from "react-router-dom";
import VideoDetailsSidebar from "../components/core/viewCourse/VideoDetailsSidebar";
import { fullCourseDetails } from "../service/operations/CourseApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
     setComplateLectureData,
     setTotalNoOfLectures,
     setCourseEntireData,
     setCourseSectionData,
} from "../../src/slices/viewCourseSlice";
import CourseReviewModal from "../components/core/viewCourse/CourseReviewModal";
const ViewCourse = () => {
     const { courseId } = useParams();
     const { token } = useSelector((state) => state.auth);
     const dispatch = useDispatch()
     const [reviewModal, setReviewModal] = useState(false)
     useEffect(() => {
          (async () => {
               const response = await fullCourseDetails(token, courseId);

               dispatch(setCourseSectionData(response.courseDetails.courseContent));
               dispatch(setCourseEntireData(response.courseDetails));
               dispatch(setComplateLectureData(response.completedVideos))

               let lectures = 0;
               response?.courseDetails?.courseContent?.forEach((section) => {
                    lectures += section.subSection.length
               });
               dispatch(setTotalNoOfLectures(lectures))
               console.log(response)

          })();
     }, []);


     return (
          <>
               <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                    {/* video side bar */}
                    <VideoDetailsSidebar setReviewModal={setReviewModal} />
                    <div className="min-h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                         <div className="m-auto w-11/12 max-w-[1000px] py-10">
                              <Outlet />
                         </div>
                    </div>
               </div>
               {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
          </>
     );
};

export default ViewCourse;

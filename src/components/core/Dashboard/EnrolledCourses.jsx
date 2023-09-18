import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userEnrolledCourse } from "../../../service/operations/profileApi";
import PrograseBar from '@ramonak/react-progress-bar'
import Spinner from "../../common/Spinner";
import { useNavigate } from "react-router-dom";
const EnrolledCourses = () => {
     const { token } = useSelector((state) => state.auth);
     const [enrolledCourse, setEnrolledCourse] = useState([]);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate()
     useEffect(() => {
          (async () => {
               try {
                    setLoading(true);
                    const response = await userEnrolledCourse(token);
                    setEnrolledCourse(response);
                    setLoading(false);
               } catch (error) { }
          })();
     }, []);
     return (
          <>
               {/* heading */}
               <h1 className="text-3xl text-richblack-5 capitalize">
                    Enrolled course
               </h1>
               <div className="border-b my-1 border-richblack-800"></div>
               <div>
                    {loading || !enrolledCourse ? (
                         <Spinner />
                    ) : !enrolledCourse.length ? (
                         <div className="grid h-[10vh] place-items-center w-full">
                              <p className="text-richblack-5">
                                   You have not enrolled in any course yet.
                              </p>
                         </div>
                    ) : (
                         <div className="text-richblack-5 my-5">
                              {/* Heading */}
                              <div className="flex rounded-t-lg bg-richblack-500">
                                   <p className="w-[45%] px-5 py-3">
                                        Course Name
                                   </p>
                                   <p className="w-1/4 px-2 py-3">Duration</p>
                                   <p className="flex-1 px-2 py-3">Progress</p>
                              </div>
                              {enrolledCourse.map((course, i, arr) => {
                                   return (
                                        <div
                                             onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]._id}/sub-section/${course?.courseContent?.[0]?.subSection?.[0]?._id}`)}
                                             className={`flex items-center border border-richblack-700 ${i === arr.length - 1
                                                  ? "rounded-b-lg"
                                                  : "rounded-none"
                                                  }`}
                                             key={i}
                                        >
                                             <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3">
                                                  <img
                                                       src={course.thumbnail}
                                                       alt="course image"
                                                       className="h-14 w-14 rounded-lg object-cover"
                                                  />
                                                  <div className="flex max-w-xs flex-col gap-2">
                                                       <p className="font-semibold mt-1">
                                                            {course.courseName}
                                                       </p>
                                                       <p className="text-xs text-richblack-300">
                                                            {course
                                                                 .courseDescription
                                                                 .length > 50
                                                                 ? `${course.courseDescription.slice(0, 50)}...`
                                                                 : `${course.courseDescription}`}
                                                       </p>
                                                  </div>
                                             </div>
                                             <div className="w-1/4 px-2 py-3">
                                                  <p>
                                                       {course.totalDuration}
                                                  </p>
                                             </div>
                                             <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                                  <p>{course.progressPercentage || 0}%</p>
                                                  <PrograseBar
                                                       height="8px"
                                                       completed={course.progressPercentage || 0}
                                                       isLabelVisible={false}
                                                  />
                                             </div>
                                        </div>
                                   );
                              })}
                         </div>
                    )}
               </div>
          </>
     );
};

export default EnrolledCourses;

import React, { useState } from "react";
import { formattedDate } from "../../../utils/dateFormate";
import { COURSE_STATUS } from "../../../utils/constants";
import { HiClock } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useSelector } from "react-redux";
import { deleteCourses, getInstructorCourses } from "../../../service/operations/CourseApi";

const CourseInfoTable = ({ instructorCourses, setInstructorCourses }) => {
     const navigate = useNavigate();
     const TRUNCATE_LENGTH = 30;
     const [confirmationModal, setConfirmationModal] = useState(null);
     const [loading, setLoadign] = useState(false);
     const { token } = useSelector((state) => state.auth);

     console.log("ins", instructorCourses);


     const handleCourseDelete = async (courseId) => {
          setLoadign(true);
          await deleteCourses(token, { courseId: courseId });
          const result = await getInstructorCourses(token)
          if (result) {

               console.log("result if k andar", result);
               setInstructorCourses(result)
          }
          setConfirmationModal(null)
          setLoadign(false);
     };


     return (
          <>
               <div
                    className={`flex gap-y-5 ${instructorCourses?.length === 1 ? 'justify-start' : 'justify-evenly'}  flex-wrap mt-10 h-screen overscroll-y-auto`}
               >
                    {instructorCourses?.length === 0 ? (
                         <h1 className="text-4xl text-richblack-5 text-center">
                              No Course Here...
                         </h1>
                    ) : (
                         instructorCourses?.map((courses) => (
                              <div
                                   className={`max-w-sm sm:w-[400px] flex flex-col items-center h-[400px] rounded shadow-xl shadow-blue-200/25 `}
                              >
                                   <div className="h-[200px]">
                                        <img
                                             src={courses?.thumbnail}
                                             alt={courses?.courseName}
                                             className="w-[380px] h-[200px] rounded-lg object-cover"
                                        />
                                   </div>
                                   <div className="w-full mt-2 px-2">
                                        <div className="flex  items-center justify-between">
                                             <h1 className="font-bold text-xl text-yellow-50/70 uppercase">{courses?.courseName}</h1>
                                             <div className="text-richblack-200">
                                                  <button
                                                       type="button"
                                                       className="px-1 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                                                       onClick={() => navigate(`/dashboard/edit-course/${courses._id}`)}
                                                  >
                                                       <MdEdit size={20} />
                                                  </button>
                                                  <button
                                                       type="button"
                                                       className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                                       onClick={() => {
                                                            setConfirmationModal(
                                                                 {
                                                                      title: "Do you want to delete this course?",
                                                                      subTitle: "All the data related to this course will be deleted",
                                                                      confirmBtnTxt: loading
                                                                           ? "Loading..."
                                                                           : "Yes",
                                                                      cancelBtnTxt: "Cancel",
                                                                      btnConfirmHandler: () => !loading
                                                                           ? handleCourseDelete(courses._id)
                                                                           : {},
                                                                      btnCancelHandler: () => !loading
                                                                           ? setConfirmationModal(null)
                                                                           : {},
                                                                 }
                                                            );
                                                       }}
                                                  >
                                                       <AiFillDelete size={20} />
                                                  </button>
                                             </div>

                                        </div>
                                        <p className="text-lg font-medium text-richblack-50">₹{courses?.price}

                                        </p>
                                        <div className="my-2" >
                                             {courses?.status ===
                                                  COURSE_STATUS.DRAFT ? (
                                                  <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[11px] font-medium text-pink-100">
                                                       <HiClock
                                                            size={14}
                                                       />
                                                       Drafted
                                                  </p>
                                             ) : (
                                                  <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[11px] font-medium text-yellow-100">
                                                       <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                                            <FaCheck
                                                                 size={8}
                                                            />
                                                       </div>
                                                       Published
                                                  </p>
                                             )}
                                        </div>
                                        <div className="text-sm mt-3 font-medium text-richblack-50">
                                             {/* course description */}
                                             <p className="my-1 leading-5 tracking-wide break-all">
                                                  {courses?.courseDescription?.split(" ").length >
                                                       TRUNCATE_LENGTH
                                                       ? courses.courseDescription
                                                            .split(" ")
                                                            .slice(0, TRUNCATE_LENGTH)
                                                            .join(" ") + "..."
                                                       : courses.courseDescription}
                                             </p>
                                             <p className="text-richblack-600">
                                                  Created:{" "}
                                                  {formattedDate(
                                                       courses.createdAt
                                                  )}
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         ))
                    )}
               </div>
               {confirmationModal && (
                    <ConfirmationModal modalData={confirmationModal} />
               )}
          </>
     );
};

export default CourseInfoTable;

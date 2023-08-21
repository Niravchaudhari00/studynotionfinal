import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { useDispatch, useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { editCourseDetailas } from "../../../../../service/operations/CourseApi";

const PublishCourse = () => {
     const [loading, setLoading] = useState(false);
     const { register, handleSubmit, setValue, getValues } = useForm();
     const dispatch = useDispatch();
     const { token } = useSelector((state) => state.auth);
     const { course } = useSelector((state) => state.course);
     const navigate = useNavigate();

     console.log(`course value = >`, course.status);

     // when you change value
     useEffect(() => {
          if (course?.status === COURSE_STATUS.PUBLISHED) {
               setValue("publish", true);
          }
     }, []);

     // goto the course
     const goToMyCourse = () => {
          dispatch(resetCourseState());
          navigate('/dashboard/my-courses');
     };

     // save change handle
     const HandleSaveChange = async (data) => {
          if (
               (course?.status === COURSE_STATUS.PUBLISHED &&
                    getValues("publish") === true) ||
               (course?.status === COURSE_STATUS.DRAFT &&
                    getValues("publish") === false)
          ) {
               goToMyCourse();
               return;
          }

          // form data
          const formData = new FormData();
          formData.append("courseId", course._id);
          const courseStatus = getValues("publish")
               ? COURSE_STATUS.PUBLISHED
               : COURSE_STATUS.DRAFT;
          formData.append("status", courseStatus);

          // course Edit api call
          setLoading(true)
          const result = await editCourseDetailas(formData, token)
          if (result) {
               goToMyCourse()
          }
          setLoading(false)
     };
     // Go Back
     const handleGoBack = () => {
          dispatch(setStep(2));
     };
     return (
          <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
               <p className="text-2xl font-semibold text-richblack-5">
                    Publish Settings
               </p>
               <form onSubmit={handleSubmit(HandleSaveChange)}>
                    <div className="my-6 mb-8 flex items-center">
                         <input
                              type="checkbox"
                              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                              {...register("publish")}
                         />
                         <label htmlFor="publish">
                              <span className="ml-2 text-richblack-400">
                                   Make this course as public
                              </span>
                         </label>
                    </div>

                    <div className="flex justify-end gap-x-4">
                         <button
                              type="button"
                              onClick={handleGoBack}
                              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                         >
                              Back
                         </button>
                         <IconBtn
                              disabled={loading}
                              text={`Save Change`}
                         ></IconBtn>
                    </div>
               </form>
          </div>
     );
};

export default PublishCourse;

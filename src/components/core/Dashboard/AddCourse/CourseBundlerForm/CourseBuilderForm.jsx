import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { IoAddCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
     addSection,
     updateSection,
} from "../../../../../service/operations/CourseApi";
import {
     setCourse,
     setEditCourse,
     setStep,
} from "../../../../../slices/courseSlice";

import NestedView from "./NestedView";
import { MdNavigateNext } from "react-icons/md";
const CourseBuilderForm = () => {
     const dispatch = useDispatch();
     const { token } = useSelector((state) => state.auth);
     const { course, editCourse } = useSelector((state) => state.course);

     // console.log("COURSE DETAILS => ", course);
     const [editSection, setEditSection] = useState(null);
     const [loading, setLoading] = useState(false);

     const {
          register,
          handleSubmit,
          formState: { errors },
          getValues,
          setValue,
     } = useForm();

     // Save and update section
     const handleSaveSection = async (data) => {
          setLoading(true);
          let result;
          if (editSection) {
               result = await updateSection(token, {
                    courseId: course._id,
                    sectionId: editSection,
                    sectionName: data.sectionName,
               });
          } else {
               result = await addSection(token, {
                    courseId: course._id,
                    sectionName: data.sectionName,
               });
          }

          if (result) {
               dispatch(setCourse(result));
               setEditSection(null);
               setValue("sectionName", "");
          }
          setLoading(false);
     };
     // Cancel Edit
     const cancelEditHandle = () => {
          setEditSection(null);
          setValue("sectionName", "");
     };

     const handleEditSection = () => {};

     // Go Back
     const GoBack = () => {
          dispatch(setStep(1));
          dispatch(setEditCourse(true));
     };
     const GoNext = () => {
          console.log("next click");
     };
     return (
          <>
               <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
                    <p className="text-2xl font-semibold text-richblack-5">
                         Course Builder
                    </p>
                    <form
                         className="space-y-4"
                         onSubmit={handleSubmit(handleSaveSection)}
                    >
                         <div className="flex flex-col space-y-2">
                              <label
                                   htmlFor="sectionName"
                                   className="text-sm text-richblack-5"
                              >
                                   Section name{" "}
                                   <sup className="text-pink-200">*</sup>
                              </label>
                              <input
                                   id="sectionName"
                                   {...register("sectionName", {
                                        required: true,
                                   })}
                                   type="text"
                                   className="form-style w-full"
                                   placeholder="Add a section to build your course"
                              />
                              {errors.sectionName && (
                                   <span className="ml-2 text-xs tracking-wide text-pink-200">
                                        section is required
                                   </span>
                              )}
                         </div>
                         <div className="flex justify-start space-x-4">
                              <IconBtn
                                   type={`submit`}
                                   disabled={loading}
                                   text={
                                        editSection
                                             ? "Edit Section name"
                                             : "Create section"
                                   }
                              >
                                   <IoAddCircleOutline
                                        size={20}
                                        className="ml-2"
                                   />
                              </IconBtn>
                              {editSection && (
                                   <button
                                        type="button"
                                        onClick={cancelEditHandle}
                                        className="cursor-pointer px-2 font-semibold rounded-md bg-yellow-50 text-richblack-900"
                                   >
                                        Cancel
                                   </button>
                              )}
                         </div>
                    </form>
                    {course.courseContent.length > 0 && (
                         <NestedView handleEditSection={handleEditSection} />
                    )}
                    <div className="flex justify-end space-x-4">
                         <button
                              onClick={GoBack}
                              className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                         >
                              Back
                         </button>
                         <IconBtn
                              onclick={GoNext}
                              text={`Next`}
                              disabled={loading}
                         >
                              <MdNavigateNext />
                         </IconBtn>
                    </div>
               </div>
          </>
     );
};

export default CourseBuilderForm;

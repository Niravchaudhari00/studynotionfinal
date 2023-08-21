import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
     addCourse,
     getCourseCategories,
     editCourseDetailas,
} from "../../../../../service/operations/CourseApi";
import { useDispatch, useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import ChipInput from "./ChipInput";
import Uploadthumnail from "./Uploadthumnail";
import Requirement from "./Requirement";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { MdNavigateNext } from "react-icons/md";
import { toast } from "react-hot-toast";

const CourseInformationForm = () => {
     const { token } = useSelector((state) => state.auth);
     const dispatch = useDispatch();
     const {
          register,
          setValue,
          getValues,
          handleSubmit,
          formState: { errors },
     } = useForm();

     const { course, editCourse } = useSelector((state) => state.course);
     const [courseCategories, setCourseCategories] = useState([]);
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          const fetchCetories = async () => {
               setLoading(true);
               const courseCategories = await getCourseCategories();
               if (courseCategories.length > 0) {
                    setCourseCategories(courseCategories);
               }
               setLoading(false);
          }


          if (editCourse) {
               console.log(`Edit mode => `, course.category);
               setValue("courseName", course.courseName);
               setValue("courseDescription", course.courseDescription);
               setValue("courseBenefits", course.whatYouWillLearn);
               setValue("price", course.price);
               setValue("courseCategory", course.category);
               setValue("courseTag", course.tag);
               setValue("courseInstruction", course.instructions);
               setValue("courseThumnail", course.thumbnail);
          }

          fetchCetories();
     }, []);

     // is form update or not
     const isFormUpdate = () => {
          const currentValue = getValues();
          if (
               currentValue.courseName !== course.courseName ||
               currentValue.courseDescription !== course.courseDescription ||
               currentValue.courseBenefits !== course.whatYouWillLearn ||
               currentValue.price !== course.price ||
               currentValue.courseCategory !== course.category._id ||
               currentValue.courseTag.toString() !== course.tag.toString() ||
               currentValue.courseInstruction.toString() !==
               course.instructions.toString() ||
               currentValue.courseThumnail !== course.thumbnail
          ) {
               return true;
          }
          return false;
     };

     const handleOnSubmit = async (data) => {
          // if edit course
          if (editCourse) {

               if (isFormUpdate()) {
                    const currentValue = getValues();

                    const formData = new FormData();
                    formData.append("courseId", course._id);
                    if (currentValue.courseName !== course.courseName) {
                         formData.append("courseName", data.courseName);
                    }
                    if (
                         currentValue.courseDescription !==
                         course.courseDescription
                    ) {
                         formData.append(
                              "courseDescription",
                              data.courseDescription
                         );
                    }
                    if (
                         currentValue.courseBenefits !== course.whatYouWillLearn
                    ) {
                         formData.append(
                              "whatYouWillLearn",
                              data.courseBenefits
                         );
                    }
                    if (currentValue.price !== course.price) {
                         formData.append("price", data.price);
                    }
                    if (currentValue.courseCategory !== course.category._id) {
                         formData.append("category", data.courseCategory);

                    }
                    if (
                         currentValue.courseTag.toString() !==
                         course.tag.toString()
                    ) {
                         formData.append("tag", JSON.stringify(data.courseTag));
                    }
                    if (
                         currentValue.courseInstruction.toString() !==
                         course.instructions.toString()
                    ) {
                         formData.append(
                              "instructions",
                              JSON.stringify(data.courseInstruction)
                         );
                    }
                    if (currentValue.courseThumnail !== course.thumbnail) {
                         formData.append("thumbnailImage", data.courseThumnail);
                    }

                    // edito course details saving
                    setLoading(true);
                    const result = await editCourseDetailas(formData, token);
                    setLoading(false);
                    if (result) {
                         dispatch(setStep(2));
                         dispatch(setCourse(result));
                    }
               } else {
                    toast.error("No change mode this form");
               }
               return;
          }

          // save a course
          const formData = new FormData();
          formData.append("courseName", data.courseName);
          formData.append("courseDescription", data.courseDescription);
          formData.append("whatYouWillLearn", data.courseBenefits);
          formData.append("price", data.price);
          formData.append("category", data.courseCategory);
          formData.append("tag", JSON.stringify(data.courseTag));
          formData.append("status", COURSE_STATUS.DRAFT);
          formData.append(
               "instructions",
               JSON.stringify(data.courseInstruction)
          );
          formData.append("thumbnailImage", data.courseThumnail);

          // course add 
          setLoading(true);
          const result = await addCourse(formData, token);
          if (result) {
               dispatch(setStep(2));
               dispatch(setCourse(result));
          }
          setLoading(false);
     };

     return (
          <>
               <form
                    onSubmit={handleSubmit(handleOnSubmit)}
                    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
               >
                    <div className="flex flex-col space-y-2">
                         <label
                              className="text-sm text-richblack-5"
                              htmlFor="courseName"
                         >
                              Course Title{" "}
                              <sup className="text-pink-200">*</sup>
                         </label>
                         <input
                              id="courseName"
                              placeholder="Enter Course Title"
                              {...register("courseName", { required: true })}
                              className="form-style w-full"
                         />
                         {errors.courseName && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                   Course title is required
                              </span>
                         )}
                    </div>
                    <div className="flex flex-col space-y-2">
                         <label
                              className="text-sm text-richblack-5"
                              htmlFor="courseDescription"
                         >
                              Course Short Description{" "}
                              <sup className="text-pink-200">*</sup>
                         </label>
                         <textarea
                              id="courseDescription"
                              placeholder="Enter Description"
                              {...register("courseDescription", {
                                   required: true,
                              })}
                              className="form-style resize-x-none min-h-[130px] w-full"
                         />
                         {errors.courseDescription && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                   Course Description is required
                              </span>
                         )}
                    </div>
                    <div className="flex flex-col space-y-2">
                         <label
                              className="text-sm text-richblack-5"
                              htmlFor="price"
                         >
                              Course Price{" "}
                              <sup className="text-pink-200">*</sup>
                         </label>
                         <div className="relative">
                              <input
                                   id="price"
                                   placeholder="Enter Course Price"
                                   {...register("price", {
                                        required: true,
                                        valueAsNumber: true,
                                        pattern: {
                                             value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                        },
                                   })}
                                   className="form-style w-full !pl-12"
                              />
                              <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                         </div>
                         {errors.price && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                   Course Price is required
                              </span>
                         )}
                    </div>
                    <div className="flex flex-col space-y-2">
                         <label
                              className="text-sm text-richblack-5"
                              htmlFor="category"
                         >
                              Course Category{" "}
                              <sup className="text-pink-200">*</sup>
                         </label>
                         <select
                              id="category"
                              defaultValue={''}
                              className="form-style w-full"
                              {...register("courseCategory", { required: true })}
                         >
                              <option value="" disabled>
                                   Choose a Category
                              </option>
                              {!loading &&
                                   courseCategories?.map((category, index) => (
                                        <option key={index} value={category?._id}>
                                             {category?.name}
                                        </option>
                                   ))}
                         </select>
                         {errors.courseCategory && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                   Course categories is required
                              </span>
                         )}
                    </div>
                    {/* add the chipInput */}
                    <ChipInput
                         label="Tags"
                         name="courseTag"
                         setValue={setValue}
                         getValue={getValues}
                         register={register}
                         placeholder={"Enter Tags and press Enter"}
                         errors={errors}
                    />
                    {/* Upload thumnail */}
                    <Uploadthumnail
                         label={"Course thumnail"}
                         name={"courseThumnail"}
                         errors={errors}
                         register={register}
                         setValue={setValue}
                         editCourse={editCourse ? course?.thumbnail : null}
                    />
                    {/* course Benifites */}
                    <div className="flex flex-col space-y-2">
                         <label
                              className="text-sm text-richblack-5"
                              htmlFor="courseBenefits"
                         >
                              Benefits of the course{" "}
                              <sup className="text-pink-200">*</sup>
                         </label>
                         <textarea
                              id="courseBenefits"
                              placeholder="Enter benefits of the course"
                              {...register("courseBenefits", {
                                   required: true,
                              })}
                              className="form-style resize-x-none min-h-[130px] w-full"
                         />
                         {errors.courseBenefits && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200">
                                   Benefits of the course is required
                              </span>
                         )}
                    </div>
                    {/* Course Instruction */}
                    <Requirement
                         label={"Requirement/Instruction"}
                         name={"courseInstruction"}
                         register={register}
                         setValue={setValue}
                         errors={errors}
                    />
                    <div className="flex justify-end gap-x-2">
                         {editCourse && (
                              <button
                                   onClick={() => dispatch(setStep(2))}
                                   disabled={loading}
                                   className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                              >
                                   continue without saving
                              </button>
                         )}
                         <IconBtn
                              text={!editCourse ? `Next` : `Save Change`}
                              disabled={loading}
                         >
                              <MdNavigateNext />
                         </IconBtn>
                    </div>
               </form>
          </>
     );
};

export default CourseInformationForm;

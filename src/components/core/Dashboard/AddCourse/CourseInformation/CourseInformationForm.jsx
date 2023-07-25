import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getCourseCategories } from "../../../../../service/operations/CourseApi";
import { useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import ChipInput from "./ChipInput";
import Uploadthumnail from "./Uploadthumnail";
import Requirement from "./Requirement";
const CourseInformationForm = () => {
     const {
          register,
          setValue,
          getValues,
          handleSubmit,
          formState: { errors },
     } = useForm();

     const { course, editCourse } = useSelector((state) => state.course);
     const [courseCategories, setCourseCategories] = useState([]);
     const [laoding, setLoading] = useState(false);
     useEffect(() => {
          (async () => {
               setLoading(true);
               const courseCategories = await getCourseCategories();
               if (courseCategories.length > 0) {
                    setCourseCategories(courseCategories);
               }
               setLoading(false);
          })();

          // if edit the course
          // if (editCourse) {
          //   setValue();
          // }
     }, []);

     const handleOnSubmit = async (data) => {
          // Save course
          const formData = new FormData();
          console.log(formData);
          formData.append("courseName", data.courseName);
          formData.append("courseDescription", data.courseDescription);
          formData.append("whatYouWillLearn", data.courseBenefits);
          formData.append("price", data.price);
          formData.append("category", data.category);
          formData.append("tag", JSON.stringify(data.courseTag));
          formData.append("status", COURSE_STATUS.DRAFT);
          formData.append("instructions", data.instructions);
          formData.append("thumnailImage", data.thamnailImage);
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
                              name="category"
                              id="category"
                              defaultValue={""}
                              className="form-style w-full"
                              {...register("category", { required: true })}
                         >
                              <option value="" disabled>
                                   Selecte the category
                              </option>
                              {!laoding &&
                                   courseCategories?.map((category, i) => (
                                        <option key={i} value={category?._id}>
                                             {category?.name}
                                        </option>
                                   ))}
                         </select>
                         {errors.category && (
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
                         editCourse={editCourse ? course?.thamnailImage : null}
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
               </form>
          </>
     );
};

export default CourseInformationForm;

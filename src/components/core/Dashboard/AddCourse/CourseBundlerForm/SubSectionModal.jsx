import IconBtn from "../../../../common/IconBtn";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import Uploadthumnail from "../CourseInformation/Uploadthumnail";
import { useEffect, useState } from "react";
import {
     addSubSection,
     updateSubSection,
} from "../../../../../service/operations/CourseApi";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../../../../slices/courseSlice";
import { toast } from "react-hot-toast";

const SubSectionModal = ({
     setModalData,
     modalData,
     add = false,
     edit = false,
     view = false,
}) => {
     const { course } = useSelector((state) => state.course);
     const { token } = useSelector((state) => state.auth);
     const [loading, setLoading] = useState(false);
     const dispatch = useDispatch();

     const {
          register,
          handleSubmit,
          setValue,
          getValues,
          formState: { errors },
     } = useForm();

     // when you changing own dom
     useEffect(() => {
          if (view || edit) {
               setValue("title", modalData.title);
               setValue("description", modalData.description);
               setValue("lectureVideo", modalData.videoUrl);
          }
     }, []);

     // is form data update or not
     const isFormUpdate = () => {
          const currentValue = getValues();
          if (
               currentValue.title !== modalData.title ||
               currentValue.description !== modalData.description ||
               currentValue.lectureVideo !== modalData.videoUrl
          ) {
               return true;
          }
          return false;
     };

     // Edit Sub Section
     const editSubSectionHandler = async () => {

          const currentValue = getValues();
          const formData = new FormData();

          formData.append("sectionId", modalData.sectionId);
          formData.append("subSectionId", modalData._id);

          if (currentValue.title !== modalData.title) {
               formData.append("title", currentValue.title);
          }
          if (currentValue.description !== modalData.description) {
               formData.append("description", currentValue.description);
          }
          if (currentValue.lectureVideo !== modalData.videoUrl) {
               formData.append("videoFile", currentValue.lectureVideo);
          }

          setLoading(true);
          const result = await updateSubSection(token, formData);
          if (result) {
               const updateCourseContent = course?.courseContent?.map(
                    (section) => (section._id === modalData.sectionId ? result : section)
               );

               const updateCourse = { ...course, courseContent: updateCourseContent };
               dispatch(setCourse(updateCourse));
          }
          setLoading(false);
          setModalData(null);
     };

     // handle on submit
     const handleOnSubmit = async (data) => {
          if (view) return;

          // when your data edit
          if (edit) {
               if (!isFormUpdate()) {
                    toast.error(`No change mode to the form`);
               } else {
                    editSubSectionHandler();
               }
               return;
          }

          const formData = new FormData();
          formData.append("sectionId", modalData);
          formData.append("title", data.title);
          formData.append("description", data.description);
          formData.append("videoFile", data.lectureVideo);

          setLoading(true);
          const result = await addSubSection(token, formData);
          if (result) {
               if (view) return;

               const updateCourseContent = course?.courseContent?.map(
                    (section) => (section._id === modalData ? result : section)
               );
               const updateCourse = {
                    ...course,
                    courseContent: updateCourseContent,
               };
               dispatch(setCourse(updateCourse));
          }

          setModalData(null);
          setLoading(false);
     };
     return (
          <>
               <div className="fixed inset-0 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-5 backdrop-blur-sm z-[1000]">
                    <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
                         <div className="flex justify-between">
                              <p className="text-richblack-5 text-xl font-semibold">
                                   {" "}
                                   {add && "Adding"} {edit && "Edting"}{" "}
                                   {view && "Viewing"} Lecture
                              </p>
                              <button
                                   onClick={() =>
                                        !loading ? setModalData(null) : {}
                                   }
                              >
                                   <RxCross2 className="text-richblack-5 text-xl font-semibold" />
                              </button>
                         </div>
                         {/* add lecture form */}
                         <form
                              onSubmit={handleSubmit(handleOnSubmit)}
                              className="space-y-8 px-8 py-10"
                         >
                              {/* Upload video */}
                              <Uploadthumnail
                                   label={`Lecture viedo`}
                                   name={`lectureVideo`}
                                   setValue={setValue}
                                   getValues={getValues}
                                   video={true}
                                   register={register}
                                   editCourse={edit ? modalData.videoUrl : null}
                                   viewData={view ? modalData.videoUrl : null}
                                   errors={errors}
                              />
                              <div className="flex flex-col space-y-2">
                                   <label
                                        className="text-richblack-5 text-sm"
                                        htmlFor="title"
                                   >
                                        Lecture Title{" "}
                                        <sup className="text-pink-200">*</sup>
                                   </label>
                                   <input
                                        disabled={view || loading}
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder="Enter Lecture Title"
                                        className="form-style w-full"
                                        {...register("title", {
                                             required: true,
                                        })}
                                   />
                                   {errors.title && (
                                        <span className="form-style resize-x-none min-h-[130px] w-full">
                                             Lecture title required
                                        </span>
                                   )}
                              </div>
                              <div className="flex flex-col space-y-2">
                                   <label
                                        className="text-richblack-5 text-sm"
                                        htmlFor="description"
                                   >
                                        Lecture Description{" "}
                                        <span className="text-pink-200">*</span>
                                   </label>
                                   <textarea
                                        disabled={view || loading}
                                        type="text"
                                        name="description"
                                        id="description"
                                        placeholder="Enter Lecture Description"
                                        className="form-style w-full"
                                        {...register("description", {
                                             required: true,
                                        })}
                                   />
                                   {errors.description && (
                                        <span className="form-style resize-x-none min-h-[130px] w-full">
                                             Lecture description required
                                        </span>
                                   )}
                              </div>
                              {!view && (
                                   <div className="flex justify-end">
                                        <IconBtn
                                             disabled={loading}
                                             text={`${loading
                                                  ? "Loading..."
                                                  : edit
                                                       ? "Change save"
                                                       : "Save"
                                                  }`}
                                        />
                                   </div>
                              )}
                         </form>
                    </div>
               </div>
          </>
     );
};

export default SubSectionModal;

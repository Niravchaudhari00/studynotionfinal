import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import RatingStar from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../service/operations/CourseApi";
const CourseReviewModal = ({ setReviewModal }) => {
     const { user } = useSelector((state) => state.profile);
     const { token } = useSelector((state) => state.auth);
     const { courseEntireData } = useSelector((state) => state.viewCourse);
     // console.log(token)
     // console.log(`course entire data : `, courseEntireData._id)

     const {
          register,
          handleSubmit,
          setValue,
          formState: { errors },
     } = useForm();

     useEffect(() => {
          setValue("courseExperience", "");
          setValue("courseRating", 0);
     }, []);

     const onRatingStar = (newRating) => {
          setValue("courseRating", newRating);
     };

     const onSubmit = async (data) => {
          try {
               await createRating(token, {
                    courseId: courseEntireData._id,
                    rating: data.courseRating,
                    review: data.courseExperience,
               });
               setReviewModal(false)
          } catch (error) {
               throw new Error(error.message);
          }
     };

     return (
          <div className="fixed inset-0 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-5 backdrop-blur-sm z-[1000]">
               <div className="w-11/12  max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                    {/* modal header */}
                    <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                         <h1 className="capitalize text-richblack-5 text-xl font-semibold">
                              add review
                         </h1>
                         <button onClick={() => setReviewModal(false)}>
                              <RxCross2 className="text-xl text-richblack-5 font-semibold" />
                         </button>
                    </div>

                    {/* modal body */}
                    <div className="bg-richblack-900 rounded-b-lg p-6">
                         <div className="flex items-center justify-center gap-x-3 mb-3">
                              <img
                                   src={user?.image}
                                   alt={user?.firstName + "profile"}
                                   className="w-[50px] aspect-square rounded-full object-cover"
                              />
                              <div className="space-y-1">
                                   <p className="text-sm font-semibold text-richblack-5">
                                        {user?.firstName} {user?.lastName}
                                   </p>
                                   <p className="text-sm text-richblack-500">
                                        Posting Publicly
                                   </p>
                              </div>
                         </div>

                         {/* review form */}
                         <form
                              onSubmit={handleSubmit(onSubmit)}
                              className="flex flex-col items-center"
                         >
                              <div className="">
                                   <RatingStar
                                        count={5}
                                        size={24}
                                        activeColor="#ffd700"
                                        half={true}
                                        onChange={onRatingStar}
                                   />
                              </div>
                              <div className="flex w-11/12 flex-col space-y-2">
                                   <label
                                        htmlFor="courseExperience"
                                        className="capitalize text-richblack-5"
                                   >
                                        add your experience{" "}
                                        <sup className="text-pink-200 font-semibold">
                                             *
                                        </sup>
                                   </label>

                                   <textarea
                                        id="courseExperience"
                                        placeholder="Add Your Experience"
                                        className="form-style resize-x-none w-full min-h-[100px]"
                                        {...register("courseExperience", {
                                             required: true,
                                        })}
                                   ></textarea>
                                   {errors.courseExperience && (
                                        <span className="text-yellow-50 text-sm font-semibold capitalize">
                                             Please add your experience
                                        </span>
                                   )}
                              </div>
                              <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                                   <button
                                        className="capitalize flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                                        onClick={() => setReviewModal(false)}
                                   >
                                        cancel
                                   </button>
                                   <IconBtn text={"Save"} />
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
};

export default CourseReviewModal;

import React from "react";
import { useSelector } from "react-redux";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
const CourseDetailsCart = ({ courses, setConfirmModal, handleBuyCourse }) => {
     const { user } = useSelector((state) => state.profile);
     const navigate = useNavigate();
     const { _id: course_id, courseName, thumbnail, price } = courses;

     const handleAddToCart = () => { };
     return (
          <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5 mt-14 mr-5">
               <img
                    src={thumbnail}
                    alt={courseName}
                    className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
               />
               <div className="px-4">
                    <p className="space-x-3 pb-4 text-3xl font-semibold">
                         ₹ {price}
                    </p>
                    <div className="flex flex-col gap-4">
                         <button
                              className="yellowButton capitalize"
                              onClick={
                                   user &&
                                        courses?.studentsEnrolled.includes(user?._id)
                                        ? () =>
                                             navigate(
                                                  "/dashboard/enrolled-courses"
                                             )
                                        : handleBuyCourse
                              }
                         >
                              {user &&
                                   courses?.studentsEnrolled.includes(user?._id)
                                   ? "Go to course"
                                   : "Buy Now"}
                         </button>

                         {(!user || !courses?.studentsEnrolled?.includes(user._id)) && (
                              <button
                                   className="blackButton capitalize"
                                   onClick={handleAddToCart}
                              >
                                   Add to Cart
                              </button>
                         )}
                    </div>
                    <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                         30-Day Money-Back Guarantee
                    </p>
                    <div>
                         <p
                              className={`my-2 text-xl font-semibold capitalize `}
                         >
                              this course includes :
                         </p>
                         <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                              {courses?.instructions?.map((item, i) => {
                                   return (
                                        <div
                                             className={`flex items-center gap-2`}
                                             key={i}
                                        >
                                             <BsFillCaretRightFill />
                                             <span>{item}</span>
                                        </div>
                                   );
                              })}
                              <div className="text-center">
                                   <button
                                        className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
                                        onClick={() => {
                                             copy(window.location.href);
                                             toast.success(
                                                  `link copy to clipboard`
                                             );
                                        }}
                                   >
                                        <FaShareSquare size={15} /> Share
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default CourseDetailsCart;

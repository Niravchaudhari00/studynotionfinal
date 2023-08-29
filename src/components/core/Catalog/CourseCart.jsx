import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import AvgRatingStart from "../../../utils/AvgRatingStart";
import RatingStar from "../../common/RatingStar";
function CourseCart({ course, height }) {
     console.log(`course : `, course);
     const [aveRatingStar, setAveRatingStar] = useState(null);
     useEffect(() => {
          const count = AvgRatingStart(course?.ratingAndReview)
          setAveRatingStar(count)
     }, [course])
     return (
          <>
               <Link to={`/courses/${course._id}`}>
                    <div className="flex flex-col drop-shadow-lg rounded-lg">
                         <img
                              src={course?.thumbnail}
                              alt={course?.courseName}
                              className={`${height} w-full object-cover rounded-xl`}
                         />
                         <div className="py-4 px-2">
                              <p className="uppercase text-2xl font-bold text-yellow-50">
                                   {course.courseName}
                              </p>
                              <p className="capitalize text-sm text-richblack-50">
                                   {course?.instructor?.firstName}{" "}
                                   {course?.instructor?.lastName}
                              </p>
                              <div className="flex items-center gap-3">
                                   <p className="text-yellow-5">{aveRatingStar || 0}</p>
                                   <RatingStar ReviewCount={aveRatingStar} />
                                   <p className="text-richblack-400">{course?.ratingAndReview?.length} Rating</p>


                              </div>
                              <p className="font-bold text-richblack-5">₹{course?.price}</p>
                         </div>
                    </div>
               </Link >
          </>
     );
}

export default CourseCart;

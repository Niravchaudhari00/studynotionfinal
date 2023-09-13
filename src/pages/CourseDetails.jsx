import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../service/operations/paymentApi";
import { useEffect, useMemo, useState } from "react";
import { fetchFullCourseDetails } from "../service/operations/CourseApi";
import Spinner from "../components/common/Spinner";
import AvgRatingStart from "../utils/AvgRatingStart";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { formattedDate } from "../utils/dateFormate";
import RatingStar from "../components/common/RatingStar";
import CourseDetailsCart from "../components/core/courseDetails/CourseDetailsCart";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Footer from "../components/common/Footer";
import CourseAccordingBar from "../components/core/courseDetails/CourseAccordingBar";
import ReviewAndRating from "../components/common/ReviewAndRating";
//Course Details Page
const CourseDetails = () => {
     const { token } = useSelector((state) => state.auth);
     const { user } = useSelector((state) => state.profile);
     const { loading } = useSelector((state) => state.profile);
     const { paymentLoading } = useSelector((state) => state.course)
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { courseId } = useParams();
     const [courseData, setCourseData] = useState(null);
     const [confirmModal, setConfirmModal] = useState(null);
     const [isActive, setIsActive] = useState(Array(0));
     // Fetch all course details
     useEffect(() => {
          (async () => {
               try {
                    const result = await fetchFullCourseDetails(courseId);
                    if (result) {
                         setCourseData(result);
                    }
               } catch (error) {
                    console.error(`something went wrong =>`, error);
               }
          })();
     }, [courseId]);

     // calculate Avg Rating
     const [avgRating, setAvgRating] = useState(0);
     const [totalNoOfLecture, setTotalNoOfLecture] = useState(0);
     useEffect(() => {
          // Avg Rating
          const count = AvgRatingStart(
               courseData?.data?.courseDetails?.ratingAndReview
          );
          setAvgRating(count);

          // Total no of lecture
          let lecture = 0;
          courseData?.courseDetails?.data?.courseContent?.forEach((sec) => {
               lecture += sec.subSection.length || 0;
          });
          setTotalNoOfLecture(lecture);
     }, [courseData]);

     if (loading || !courseData) {
          return <Spinner />;
     }
     if (!courseData?.success) {
          return <div>Error No Course here</div>;
     }

     // Desctructore of course details
     const {
          _id: course_id,
          courseName,
          courseDescription,
          thumbnail,
          price,
          instructor,
          instructions,
          courseContent,
          whatYouWillLearn,
          ratingAndReview,
          studentsEnrolled,
          createdAt,
     } = courseData?.data?.courseDetails;

     // Buy course handler
     const handleBuyCourse = () => {
          if (token) {
               buyCourse(token, [courseId], user, dispatch, navigate);
               return;
          }

          setConfirmModal({
               title: "You are not logged in!",
               subTitle: "Please login to Purchase Course.",
               confirmBtnTxt: "Login",
               cancelBtnTxt: "Cancel",
               btnConfirmHandler: () => navigate("/login"),
               btnCancelHandler: () => setConfirmModal(null),
          });

          if (paymentLoading) {
               return <Spinner />;
          }
     };

     // handleIsActive
     const handleIsActive = (course_id) => {
          setIsActive(
               !isActive.includes(course_id)
                    ? isActive.concat([course_id])
                    : isActive.filter((item) => item !== course_id)
          );
     };
     console.log(`COURSE DETAILS = >`, courseData.data);
     return (
          <>
               <div className={`relative w-full bg-richblack-800`}>
                    {/* Hero Section */}
                    <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                         <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                              <div className="relative block max-h-[30rem] lg:hidden">
                                   <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                                   <img
                                        src={thumbnail}
                                        alt="course thumbnail"
                                        className="aspect-auto w-full"
                                   />
                              </div>
                              <div
                                   className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
                              >
                                   <div>
                                        <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                                             {courseName}
                                        </p>
                                   </div>
                                   <p className={`text-richblack-200`}>
                                        {courseDescription}
                                   </p>
                                   <div className="text-md flex flex-wrap items-center gap-2">
                                        <span className="text-yellow-25">
                                             {avgRating}
                                        </span>
                                        <RatingStar
                                             Review_Count={avgRating}
                                             Star_Size={24}
                                        />
                                        <span>{`(${ratingAndReview.length} reviews)`}</span>
                                        <span>{`${studentsEnrolled.length} students enrolled`}</span>
                                   </div>
                                   <div>
                                        <p className="">
                                             Created By{" "}
                                             {`${instructor.firstName} ${instructor.lastName}`}
                                        </p>
                                   </div>
                                   <div className="flex flex-wrap gap-5 text-lg">
                                        <p className="flex items-center gap-2">
                                             {" "}
                                             <BiInfoCircle /> Created at{" "}
                                             {formattedDate(createdAt)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                             {" "}
                                             <HiOutlineGlobeAlt /> English
                                        </p>
                                   </div>
                              </div>
                              <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                                   <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                        ₹ {price}
                                   </p>
                                   <button
                                        className="yellowButton"
                                        onClick={
                                             user &&
                                                  studentsEnrolled.includes(
                                                       user?._id
                                                  )
                                                  ? () =>
                                                       navigate(
                                                            "/dashboard/enrolled-courses"
                                                       )
                                                  : handleBuyCourse
                                        }
                                   >
                                        {user &&
                                             studentsEnrolled.includes(user?._id)
                                             ? "Go to course"
                                             : "Buy Now"}
                                   </button>
                                   <button className="blackButton">
                                        Add to Cart
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
               {/* Courses Card */}
               <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                    <CourseDetailsCart
                         courses={courseData?.data?.courseDetails}
                         setConfirmModal={setConfirmModal}
                         handleBuyCourse={handleBuyCourse}
                    />
               </div>

               {/* othere section */}
               <section className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                    <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                         {/* what you we learn section */}
                         <div className="my-8 border border-richblack-600 p-8">
                              <p className="text-3xl font-semibold">
                                   What you'll learn
                              </p>
                              <ReactMarkdown className="mt-5 text-richblack-200">
                                   {whatYouWillLearn}
                              </ReactMarkdown>
                         </div>

                         {/* course content section */}
                         <div className="max-w-[830px]">
                              <div className="flex flex-col gap-3">
                                   <p className="text-[28px] font-semibold">
                                        Course Content
                                   </p>
                                   <div className="flex flex-wrap justify-between gap-2">
                                        <div className="flex gap-2 lowercase text-richblack-200 font-mono">
                                             <span>
                                                  {courseContent.length}{" "}
                                                  {`section(s)`}
                                             </span>
                                             |
                                             <span>
                                                  {totalNoOfLecture}{" "}
                                                  {`lecture(s)`}
                                             </span>
                                             |
                                             <span className="">
                                                  {
                                                       courseData.data
                                                            ?.totalDuration
                                                  }{" "}
                                                  Total length of course
                                             </span>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div className="my-2">
                              <button
                                   className="text-yellow-25"
                                   onClick={() => setIsActive([])}
                              >
                                   Collapse all sections
                              </button>
                         </div>
                         {/* course according bar */}
                         <div className="">
                              {courseContent?.map((course, i) => (
                                   <CourseAccordingBar
                                        key={i}
                                        course={course}
                                        isActive={isActive}
                                        handleIsActive={handleIsActive}
                                   />
                              ))}
                         </div>

                         {/* Author Details */}
                         <div className="mb-12 py-4">
                              <p className="text-[28px] font-semibold">Author</p>
                              <div className="flex items-center gap-4 py-4">
                                   <img
                                        src={
                                             instructor.image
                                                  ? instructor.image
                                                  : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                                        }
                                        loading="lazy"
                                        alt="Author"
                                        className="h-14 w-14 rounded-full object-cover"
                                   />
                                   <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                              </div>
                              <p className="text-richblack-50">
                                   {instructor?.additionalDetails?.about}
                              </p>
                         </div>
                    </div>
               </section>
               <ReviewAndRating />
               <Footer />
               {confirmModal && <ConfirmationModal modalData={confirmModal} />}
          </>
     );
};

export default CourseDetails;

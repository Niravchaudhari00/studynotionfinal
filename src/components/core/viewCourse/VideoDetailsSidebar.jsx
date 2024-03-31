import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
const VideoDetailsSidebar = ({ setReviewModal }) => {
     // const [toggleMenu, setToggleMenu] = useState(true);
     const toggleMenu = true;
     const navigate = useNavigate();
     const {
          courseEntireData,
          courseSectionData,
          totalNoOfLectures,
          complateLectureData,
     } = useSelector((state) => state.viewCourse);

     const { sectionId, subSectionId } = useParams();
     const [activeStatus, setActiveStatus] = useState("");
     const [videoBarActive, setVideoBarActive] = useState("");
     const location = useLocation();

     useEffect(() => {
          (() => {
               if (!courseSectionData.length) return;
               // current section index
               const currentSectionIndex = courseSectionData.findIndex(
                    (data) => data._id === sectionId
               );

               // current sub section index
               const currentSubSectionIndex = courseSectionData?.[
                    currentSectionIndex
               ]?.subSection?.findIndex((data) => data._id === subSectionId);

               // active sub section id
               const activeSubSectionId =
                    courseSectionData?.[currentSectionIndex]?.subSection?.[
                         currentSubSectionIndex
                    ]?._id;

               setActiveStatus(courseSectionData?.[currentSectionIndex]._id);
               setVideoBarActive(activeSubSectionId);
          })();
     }, [courseSectionData, courseEntireData, location.pathname]);

     return (
          <div
               className={`${toggleMenu ? "w-[230px]" : "w-[50px]"
                    } h-[calc(100vh - 3.50rem)] flex flex-col transition-all duration-200 border-r-[1px] border-r-richblack-700 bg-richblack-800 relative`}
          >
               <div className="flex mt-10 flex-col gap-y-5 border-b-[1.7px] border-b-richblack-700 mx-3 pb-5 shadow-xl">
                    {/* header menu */}
                    <div className="flex flex-row-reverse justify-between">
                         {/* add review for course */}
                         <button
                              className="capitalize p-1 px-2 bg-yellow-50 text-richblack-800  rounded-lg hover:scale-95 duration-200 transition-all shadow-xl shadow-richblack-900/40"
                              onClick={() => setReviewModal(true)}
                         >
                              add review
                         </button>
                         <button
                              className="w-[35px] h-[35px] grid place-items-center border border-richblack-700 rounded-full text-richblack-5 hover:scale-90 transition-all duration-200 shadow-xl shadow-richblack-900/40"
                              title="back"
                              onClick={() =>
                                   navigate("dashboard/enrolled-courses")
                              }
                         >
                              <IoIosArrowBack
                                   size={24}
                                   className="mr-[1.5px]"
                              />
                         </button>
                    </div>
                    <div className="flex flex-col gap-2 text-richblack-200">
                         <p className="font-semibold text-lg text-richblack-200">
                              {courseEntireData.courseName}
                         </p>
                         <p className="font-semibold">
                              <span>{complateLectureData?.length} </span> /{" "}
                              <span className=" text-yellow-50">
                                   {totalNoOfLectures}
                              </span>
                         </p>
                    </div>
               </div>

               <div className="mt-5 mx-3 h-[calc(100vh - 5rem)] overflow-y-auto">
                    {courseSectionData.map((section, index) => (
                         <div
                              key={index}
                              onClick={() => setActiveStatus(section._id)}
                              className="cursor-pointer text-sm text-richblack-5 my-1"
                         >
                              {/* section */}
                              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-2 rounded-sm">
                                   <div className="w-[70%]">
                                        <p className="font-semibold text-richblack-5">
                                             {section?.sectionName}
                                        </p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <span
                                             className={`${activeStatus === section?._id
                                                  ? "rotate-0"
                                                  : "rotate-180"
                                                  } transition-all duration-200 `}
                                        >
                                             <BsChevronDown />
                                        </span>
                                   </div>
                              </div>

                              {/* sub section */}
                              {activeStatus === section?._id && (
                                   <div className="transition-[height] duration-200 ease-in-out">
                                        {section?.subSection?.map(
                                             (topic, i) => {
                                                  return (
                                                       <div
                                                            className={`flex gap-3 px-5 py-2 rounded-sm
                                                                  ${videoBarActive ===
                                                                      topic._id
                                                                      ? "bg-yellow-200 font-semibold text-richblack-800"
                                                                      : "hover:bg-richblack-900"
                                                                 }`}
                                                            key={i}
                                                            onClick={() => {
                                                                 navigate(
                                                                      `/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${topic._id}`
                                                                 );

                                                                 setVideoBarActive(
                                                                      topic._id
                                                                 );
                                                            }}
                                                       >
                                                            <input
                                                                 type="checkbox"
                                                                 checked={complateLectureData.includes(
                                                                      topic._id
                                                                 )}
                                                                 onChange={() => { }}
                                                            />
                                                            <span>
                                                                 {topic?.title}
                                                            </span>
                                                       </div>
                                                  );
                                             }
                                        )}
                                   </div>
                              )}
                         </div>
                    ))}
               </div>
          </div>
     );
};

export default VideoDetailsSidebar;

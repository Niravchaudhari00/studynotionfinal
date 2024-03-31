import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updatecomplateLectureData } from "../../../slices/viewCourseSlice";
import { markComplateLecture } from "../../../service/operations/CourseApi";
import IconBtn from "../../common/IconBtn";
import { RiRestartLine } from 'react-icons/ri'

import { BigPlayButton, Player, } from "video-react";
import "video-react/dist/video-react.css";

const VideoDetails = () => {
     const { courseId, sectionId, subSectionId } = useParams();
     const {
          courseEntireData,
          courseSectionData,
          totalNoOfLectures,
          complateLectureData,
     } = useSelector((state) => state.viewCourse);
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const { token } = useSelector((state) => state.auth);
     const localtion = useLocation();
     const playRef = useRef(null);
     const [loading, setLoading] = useState(false);
     const [videoData, setVideoData] = useState([]);
     const [previewSourse, setPreviewSourse] = useState("");
     const [videoEnd, setVideoEnd] = useState(false);

     useEffect(() => {
          (async () => {
               if (!courseSectionData.length) return;
               if (!courseId && !sectionId && !subSectionId) {
                    navigate("/dashboard/enrolled-courses");
               } else {
                    const filterData = courseSectionData.filter(
                         (section) => section._id === sectionId
                    );
                    const filterVideoData = filterData[0]?.subSection.filter(
                         (data) => data._id === subSectionId
                    );

                    setVideoData(filterVideoData[0]);
                    setPreviewSourse(courseEntireData.thumbnail);
                    setVideoEnd(false);
               }
          })();
     }, [courseEntireData, courseSectionData, localtion.pathname]);

     console.log(videoData);

     // Is First Video
     const isFirstVideo = () => {
          const currentSectionIndex = courseSectionData.findIndex(
               (data) => data._id === sectionId
          );

          const currentSubSectionIndex = courseSectionData[
               currentSectionIndex
          ].subSection.findIndex((data) => data._id === subSectionId);

          if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
               return true;
          } else {
               return false;
          }
     };

     // Go to the next video
     const goToNextVideo = () => {
          const currentSectionIndex = courseSectionData.findIndex(
               (data) => data._id === sectionId
          );
          const noOfSubSection =
               courseSectionData[currentSectionIndex].subSection.length;
          const currentSubSectionIndex = courseSectionData[
               currentSectionIndex
          ].subSection.findIndex((data) => data._id === subSectionId);

          if (currentSubSectionIndex !== noOfSubSection - 1) {
               const nextSubSection =
                    courseSectionData[currentSectionIndex].subSection[
                         currentSubSectionIndex + 1
                    ]._id;
               navigate(
                    `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection}`
               );
          } else {
               const nextSection =
                    courseSectionData[currentSectionIndex + 1]._id;
               const nextSubSection =
                    courseSectionData[currentSectionIndex + 1].subSection[0]
                         ._id;

               console.log(`next Section`, nextSection);
               console.log(`next sub Section`, nextSubSection);
               navigate(
                    `/view-course/${courseId}/section/${nextSection}/sub-section/${nextSubSection}`
               );
          }
     };

     // Go to the previes video
     const goToPrevVideo = () => {
          const currentSectionIndex = courseSectionData.findIndex(
               (data) => data._id === sectionId
          );
          const noOfSubSection =
               courseSectionData[currentSectionIndex].subSection.length;
          const currentSubSectionIndex = courseSectionData[
               currentSectionIndex
          ].subSection.findIndex((data) => data._id === subSectionId);

          if (currentSubSectionIndex !== noOfSubSection - 1) {
               const nextSubSection =
                    courseSectionData[currentSectionIndex].subSection[
                         currentSubSectionIndex - 1
                    ]._id;
               navigate(
                    `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSection}`
               );
          } else {
               const nextSection =
                    courseSectionData[currentSectionIndex - 1]._id;
               const nextSubSection =
                    courseSectionData[currentSectionIndex - 1].subSection[0]
                         ._id;

               console.log(`next Section`, nextSection);
               console.log(`next sub Section`, nextSubSection);
               navigate(
                    `/view-course/${courseId}/section/${nextSection}/sub-section/${nextSubSection}`
               );
          }
     };

     // is last video
     const isLastVideo = () => {
          const currentSectionIndex = courseSectionData.findIndex(
               (data) => data._id === sectionId
          );
          const noOfSubSection =
               courseSectionData[currentSectionIndex].subSection.length;
          const currentSubSectionIndex = courseSectionData[
               currentSectionIndex
          ].subSection.findIndex((data) => data._id === subSectionId);

          if (
               currentSectionIndex === courseSectionData.length - 1 &&
               currentSubSectionIndex === noOfSubSection - 1
          ) {
               return true;
          } else {
               return false;
          }
     };

     // lecture complated
     const handleMarkComplateLecture = async () => {
          setLoading(true);
          try {
               const res = markComplateLecture(token, {
                    courseId: courseId,
                    subSectionId: subSectionId,
               });

               if (res) {
                    dispatch(updatecomplateLectureData(subSectionId));
               }
          } catch (error) {
               console.log(`something went wrong`);
          }
          setLoading(false);
     };

     return (
          <>
               <div className="flex flex-col">
                    {!videoData ? (
                         <div>
                              <img
                                   src={previewSourse}
                                   alt={courseEntireData.courseName}
                                   className="h-full w-full object-cover rounded-md"
                              />
                         </div>
                    ) : (
                         <div>
                              <Player
                                   ref={playRef}
                                   aspectRatio="16:9"
                                   playsInline
                                   src={videoData.videoUrl}

                                   onEnded={() => setVideoEnd(true)}

                              >
                                   <BigPlayButton position="center" />

                                   {/* video end after that render */}
                                   <div className="">
                                        {videoEnd && (
                                             <div
                                                  style={{
                                                       backgroundImage:
                                                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                                                  }}
                                                  className="grid place-content-center z-[100] w-full h-full absolute inset-0 font-inter border border-white"
                                             >
                                                  {/* lecture complate mark */}
                                                  {!complateLectureData.includes(
                                                       subSectionId
                                                  ) && (
                                                            <IconBtn
                                                                 disabled={loading}
                                                                 onclick={
                                                                      handleMarkComplateLecture
                                                                 }
                                                                 text={
                                                                      !loading
                                                                           ? "Mark As Complate"
                                                                           : "Loading..."
                                                                 }
                                                            />
                                                       )}
                                                  {/* rewatch lecture */}
                                                  <button
                                                       className="flex justify-self-center text-4xl p-2 rounded-full bg-richblack-500 font-bold"
                                                       disabled={loading}
                                                       onClick={() => {
                                                            if (playRef?.current) {
                                                                 playRef?.current?.seek(0)
                                                                 setVideoEnd(false)
                                                            }
                                                       }} >
                                                       <RiRestartLine />
                                                  </button>
                                                  <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                                       {!isFirstVideo() && (
                                                            <button
                                                                 onClick={goToPrevVideo}
                                                                 className="blackButton"
                                                            >
                                                                 Prev
                                                            </button>)

                                                       }
                                                       {!isLastVideo() && (
                                                            <button
                                                                 onClick={goToNextVideo}
                                                                 className="blackButton"
                                                            >
                                                                 Next
                                                            </button>)
                                                       }
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </Player>
                         </div >
                    )}
                    <h1 className="mt-4 text-3xl font-semibold text-yellow-50">{videoData?.title}</h1>
                    <p className="pt-2 pb-6 text-richblack-500">{videoData?.description}</p>
               </div >
          </>
     );
};

export default VideoDetails;

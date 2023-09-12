import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
function CourseSlide({ courses }) {
     return (
          <>
               <div>
                    {courses.length > 0 ? (
                         <div className="my-10">
                              <Swiper
                                   slidesPerView={1}
                                   spaceBetween={25}
                                   loop={true}
                                   modules={[FreeMode, Pagination, Autoplay, Navigation]}
                                   breakpoints={{
                                        1024: {
                                             slidesPerView: 3,
                                        },
                                   }}
                                   autoplay={{
                                        delay: 2000,
                                        disableOnInteraction: false,
                                   }}
                                   pagination={{
                                        clickable: true,
                                   }}
                                   navigation={true}

                                   className="max-h-[30rem]"
                              >
                                   {courses?.map((course, i) => (
                                        <SwiperSlide key={i}>
                                             <Link to={`/courses/${course?._id}`}>
                                                  <div>
                                                       <img
                                                            src={course?.thumbnail}
                                                            alt=""
                                                            className="h-[250px] object-cover"
                                                       />
                                                  </div>
                                             </Link>
                                        </SwiperSlide>
                                   ))}
                              </Swiper>
                         </div>
                    ) : (
                         <div className="flex">
                              <h1 className="text-yellow-50 text-xl">
                                   No course
                              </h1>
                         </div>
                    )}
               </div>
          </>
     );
}

export default CourseSlide;

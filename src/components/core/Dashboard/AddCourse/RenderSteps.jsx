import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBundlerForm from "./CourseBundlerForm/CourseBuilderForm";
import PublishCourse from "./PublishCourse/PublishCourse";

const RenderSteps = () => {
     const { step } = useSelector((state) => state.course);

     const steps = [
          {
               id: 1,
               title: "Course Information",
          },
          {
               id: 2,
               title: "Course Builder",
          },
          {
               id: 3,
               title: "Publish",
          },
     ];
     return (
          <>
               <div className="relative mb-2 flex w-full justify-center">
                    {steps.map((item) => (
                         <React.Fragment>
                              <div
                                   key={item.id}
                                   className="flex flex-col item-center"
                              >
                                   <button
                                        className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${step === item.id
                                             ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                                             : "border-richblack-700 bg-richblack-800 text-richblack-300"
                                             } ${step > item.id &&
                                             "bg-yellow-50 text-yellow-50"
                                             }`}
                                   >
                                        {step > item.id ? (
                                             <FaCheck className="font-bold text-richblack-900" />
                                        ) : (
                                             <span>{item.id}</span>
                                        )}
                                   </button>
                              </div>
                              {item.id !== steps.length && (
                                   <div
                                        className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${step > item.id
                                             ? "border-yellow-50"
                                             : "border-richblack-500"
                                             } `}
                                   ></div>
                              )}
                         </React.Fragment>
                    ))}
               </div>
               <div
                    className={`relative mb-16 w-full flex justify-between select-none`}
               >
                    {steps.map((item) => (
                         <div
                              key={item.id}
                              className={`flex min-w-[130px] flex-col items-center gap-y-2`}
                         >
                              <p
                                   className={`${step >= item.id
                                        ? "text-richblack-5"
                                        : "text-richblack-500"
                                        } text-sm`}
                              >
                                   {item.title}
                              </p>
                         </div>
                    ))}
               </div>
               {step === 1 && <CourseInformationForm />}
               {step === 2 && <CourseBundlerForm />}
               {step === 3 && <PublishCourse />}
          </>
     );
};

export default RenderSteps;

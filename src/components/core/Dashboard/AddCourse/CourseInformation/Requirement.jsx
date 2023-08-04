import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Requirement = ({ label, name, register, setValue, errors }) => {
     const { course, editCourse } = useSelector((state) => state.course);
     const [requirementField, setRequirmentField] = useState("");
     const [requirementList, setRequirementList] = useState([]);
     // console.log(`requirementList`, requirementList);
     const handleAddRequirement = () => {
          if (requirementField) {
               setRequirementList([...requirementList, requirementField]);
               setRequirmentField("");
          }
     };
     //
     useEffect(() => {
          if (editCourse) {
               setRequirementList(course?.instructions);
          }

          register(name, {
               required: true,
               validate: (value) => value.length > 0,
          });
     }, []);
     //
     useEffect(() => {
          setValue(name, requirementList);
     }, [requirementList]);

     const handleRemoveList = (index) => {
          const updateRequirementList = [...requirementList];
          updateRequirementList.splice(index, 1);
          setRequirementList(updateRequirementList);
     };
     return (
          <>
               <div className="flex flex-col space-y-2">
                    <label htmlFor={name} className="text-sm text-richblack-5">
                         {label}
                         <sup className="text-pink-200">*</sup>
                    </label>
                    <div className="flex flex-col items-start space-y-2 relative">
                         <input
                              name={name}
                              value={requirementField}
                              type="text"
                              onChange={(e) =>
                                   setRequirmentField(e.target.value)
                              }
                              className="form-style w-full"
                         />
                         <div className="flex flex-row-reverse w-full justify-between">
                              <button
                                   type="button"
                                   onClick={handleAddRequirement}
                                   className="flex self-start  justify-center items-center font-semibold rounded-lg mt-2 bg-yellow-50 py-1 px-2 "
                              >
                                   Add
                              </button>
                              {requirementList.length > 0 && (
                                   <ul className="list-inside list-disc">
                                        {requirementList.map((list, index) => (
                                             <li
                                                  className="flex items-center text-richblack-5"
                                                  key={index}
                                             >
                                                  {list}
                                                  <button
                                                       type="button"
                                                       className="flex justify-center items-center ml-2 text-richblack-25ml-2 text-xs text-pure-greys-300"
                                                       onClick={() =>
                                                            handleRemoveList(
                                                                 index
                                                            )
                                                       }
                                                  >
                                                       remove
                                                  </button>
                                             </li>
                                        ))}
                                   </ul>
                              )}
                         </div>
                         {errors[name] && (
                              <span className="ml-2 text-xs tracking-wide text-pink-200 absolute top-12">
                                   {label} is required
                              </span>
                         )}
                    </div>
               </div>
          </>
     );
};

export default Requirement;

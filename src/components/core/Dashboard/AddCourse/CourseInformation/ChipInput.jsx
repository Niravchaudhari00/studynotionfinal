import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { toast } from "react-hot-toast";
const ChipInput = ({
     label,
     name,
     setValue,
     getValue,
     register,
     placeholder,
     errors,
}) => {
     const { editCourse, course } = useSelector((state) => state.course);
     const [chips, setChips] = useState([]);

     useEffect(() => {
          if (editCourse) {
               setChips(course?.tag);
          }
          register(name, {
               required: true,
               validate: (value) => value.length > 0,
          });
     }, []);

     useEffect(() => {
          setValue(name, chips);
     }, [chips]);

     const handleKeyDown = (e) => {
          if (e.key == "Enter" || e.key == ",") {
               e.preventDefault();

               const chipValue = e.target.value.trim();
               if (chipValue && !chips.includes(chipValue)) {
                    const newChipsValue = [...chips, chipValue];
                    setChips(newChipsValue);
                    e.target.value = "";
               }
          }
     };

     const handleDelete = (i) => {
          const newChips = chips.filter((_, index) => index !== i);
          setChips(newChips);
     };
     return (
          <div className="flex flex-col space-y-2">
               <label htmlFor={name} className="text-sm text-richblack-5">
                    {label} <sup className="text-pink-200">*</sup>
               </label>
               <div className="flex items-center w-full flex-wrap">
                    {chips.map((item, i) => (
                         <div
                              key={i}
                              className="flex items-center justify-center m-1 px-2 rounded-full bg-yellow-50 text-richblack-900 font-semibold text-sm mx-[2px]"
                         >
                              {item}
                              <button
                                   type="button"
                                   onClick={() => handleDelete(i)}
                                   className="ml-1 focus:outline-none "
                              >
                                   <MdClose className="text-sm" />
                              </button>
                         </div>
                    ))}
               </div>
               <div className="">
                    <input
                         name={name}
                         id={name}
                         type="text"
                         placeholder={placeholder}
                         onKeyDown={handleKeyDown}
                         className="form-style w-full"
                    />
                    {!chips.length > 0 ? (
                         errors[name] && (
                              <span className="ml text-xs tracking-wide text-pink-200">
                                   {label} is required{" "}
                              </span>
                         )
                    ) : (
                         <></>
                    )}
               </div>
          </div>
     );
};

export default ChipInput;

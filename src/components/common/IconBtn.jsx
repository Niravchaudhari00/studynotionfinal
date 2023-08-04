import React from "react";

const IconBtn = ({ onclick, type, text, children, disabled }) => {
     return (
          <button
               className={`flex items-center gap-x-1 ${
                    disabled === true ? `cursor-not-allowed` : `cursor-pointer`
               } rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold`}
               type={type}
               disabled={disabled}
               onClick={onclick}
          >
               {children ? (
                    <>
                         <span className="text-richblack-900">{text}</span>
                         {children}
                    </>
               ) : (
                    <span>{text}</span>
               )}
          </button>
     );
};

export default IconBtn;

import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "video-react/dist/video-react.css"
import { Player } from "video-react";
import { FiUploadCloud } from "react-icons/fi";

const Uploadthumnail = ({
     label,
     name,
     errors,
     setValue,
     register,
     editCourse = null,
     viewData = null,
     video = false,
}) => {
     const inputRef = useRef(null);
     const [selectFile, setSelectFile] = useState(null);
     const [previewsSource, setPreviewSource] = useState(
          viewData ? viewData : editCourse ? editCourse : ""
     );

     const onDrop = (accessFile) => {
          const file = accessFile[0];
          if (file) {
               privewFile(file);
               setSelectFile(file);
          }
     };

     const privewFile = (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
               setPreviewSource(reader.result);
          };
     };
     const { getInputProps, getRootProps, isDragAccept } = useDropzone({
          accept: !video
               ? { "image/*": [".jpeg", ".jpg", ".png"] }
               : { "video/*": [".mp4"] },
          onDrop,
     });

     useEffect(() => {
          register(name, { required: true });
     }, [register]);

     useEffect(() => {
          setValue(name, selectFile);
     }, [setValue, selectFile]);
     return (
          <>
               <div className="flex flex-col space-y-2">
                    <label
                         className={`text-sm text-richblack-5`}
                         htmlFor={name}
                    >
                         {label} <sup className={`text-pink-200`}>*</sup>
                    </label>
                    <div
                         className={` ${isDragAccept
                              ? "bg-richblack-600"
                              : "bg-richblack-700"
                              } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
                    >
                         {previewsSource ? (
                              <div className="flex flex-col w-full p-6 border border-white ">
                                   {!video ? (
                                        <img
                                             src={previewsSource}
                                             alt="privew"
                                             className="h-full w-full rounded-md object-cover"
                                        />
                                   ) : (
                                        <Player
                                             aspectRatio="16:9"
                                             playsInline
                                             src={previewsSource}
                                        />
                                   )}
                                   {!viewData && (
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  setPreviewSource("");
                                                  setSelectFile(null);
                                                  setValue(name, null);
                                             }}
                                             className="mt-3 text-yellow-50 underline"
                                        >
                                             cancel
                                        </button>
                                   )}
                              </div>
                         ) : (
                              <div
                                   {...getRootProps()}
                                   className="flex w-full flex-col items-center p-6"
                              >
                                   <input {...getInputProps()} ref={inputRef} />
                                   <div className="grid aspect-square rounded-full place-items-center w-14 bg-pure-greys-25">
                                        <FiUploadCloud className="text-2xl text-yellow-50" />
                                   </div>
                                   <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                                        Drag and drop an{" "}
                                        {!video ? "image" : "video"}, or click
                                        to{" "}
                                        <span className="font-semibold text-yellow-50">
                                             Browse
                                        </span>{" "}
                                        a file
                                   </p>
                                   <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                                        <li>Aspect ratio 16:9</li>
                                        <li>Recommended size 1024x576</li>
                                   </ul>{" "}

                              </div>
                         )}
                    </div>
                    {errors[name] && (
                         <span className="ml-2 text-xs tracking-wide text-pink-200">
                              {" "}
                              {label} is required
                         </span>
                    )}
               </div>
          </>
     );
};

export default Uploadthumnail;

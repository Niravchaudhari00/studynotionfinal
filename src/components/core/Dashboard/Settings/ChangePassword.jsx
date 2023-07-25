import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../../service/operations/SettingsApi";

const ChangePassword = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const { token } = useSelector((state) => state.auth);
     const [showCurrentPass, setShowCurrentPass] = useState(false);
     const [showNewPassword, setShowNewPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

     const {
          register,
          handleSubmit,
          formState: { errors, isSubmitSuccessful },
          reset,
     } = useForm();

     const submitPasswordForm = (data) => {
          if (data.newPassword !== data.confirmPassword) {
               toast.error("password and confirm password does't match.");
               return;
          }

          try {
               dispatch(changePassword(token, data, navigate));
          } catch (error) {
               console.log("something went worng");
          }
     };

     useEffect(() => {
          if (isSubmitSuccessful) {
               reset({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
               });
          }
     }, [reset, isSubmitSuccessful]);

     return (
          <>
               <form onSubmit={handleSubmit(submitPasswordForm)}>
                    <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                         <h2 className="text-lg font-semibold text-richblack-5">
                              Password
                         </h2>
                         <div className="flex flex-col gap-5 xl:flex-row">
                              <div className="relative flex flex-col gap-2 xl:w-[48%]">
                                   <label
                                        htmlFor="currentPassword"
                                        className="lable-style"
                                   >
                                        Current Password
                                   </label>
                                   <input
                                        type={
                                             showCurrentPass
                                                  ? "text"
                                                  : "password"
                                        }
                                        name="currentPassword"
                                        id="currentPassword"
                                        placeholder="Enter Current Password"
                                        className="form-style"
                                        {...register("currentPassword", {
                                             required: true,
                                        })}
                                   />
                                   {/* <span
                                        onClick={() =>
                                             setShowCurrentPass((prev) => !prev)
                                        }
                                        className="absolute right-3 top-[41px] z-[10] cursor-pointer"
                                   >
                                        {showCurrentPass ? (
                                             <AiOutlineEyeInvisible
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        ) : (
                                             <AiOutlineEye
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        )}
                                   </span> */}
                                   {errors.currentPassword && (
                                        <span className="-mt-1 text-[12px] text-yellow-100">
                                             Please enter your Current Password.
                                        </span>
                                   )}
                              </div>
                              <div className="relative flex flex-col gap-2 xl:w-[48%]">
                                   <label
                                        htmlFor="newPassword"
                                        className="lable-style"
                                   >
                                        New Password
                                   </label>
                                   <input
                                        type={
                                             showNewPassword
                                                  ? "text"
                                                  : "password"
                                        }
                                        name="newPassword"
                                        id="newPassword"
                                        placeholder="Enter New Password"
                                        className="form-style"
                                        {...register("newPassword", {
                                             required: true,
                                        })}
                                   />
                                   <span
                                        onClick={() =>
                                             setShowNewPassword((prev) => !prev)
                                        }
                                        className="absolute right-3 top-[41px] z-[10] cursor-pointer"
                                   >
                                        {showNewPassword ? (
                                             <AiOutlineEyeInvisible
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        ) : (
                                             <AiOutlineEye
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        )}
                                   </span>
                                   {errors.newPassword && (
                                        <span className="-mt-1 text-[12px] text-yellow-100">
                                             Please enter your New Password.
                                        </span>
                                   )}
                              </div>

                              <div className="relative flex flex-col gap-2 xl:w-[48%]">
                                   <label
                                        htmlFor="confirmPassword"
                                        className="lable-style"
                                   >
                                        Confirm Password
                                   </label>
                                   <input
                                        type={
                                             showConfirmPassword
                                                  ? "text"
                                                  : "password"
                                        }
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Enter Confirm Password"
                                        className="form-style"
                                        {...register("confirmPassword", {
                                             required: true,
                                        })}
                                   />
                                   <span
                                        onClick={() =>
                                             setShowConfirmPassword(
                                                  (prev) => !prev
                                             )
                                        }
                                        className="absolute right-3 top-[41px] z-[10] cursor-pointer"
                                   >
                                        {showConfirmPassword ? (
                                             <AiOutlineEyeInvisible
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        ) : (
                                             <AiOutlineEye
                                                  fontSize={24}
                                                  fill="#AFB2BF"
                                             />
                                        )}
                                   </span>
                                   {errors.confirmPassword && (
                                        <span className="-mt-1 text-[12px] text-yellow-100">
                                             Please enter your confirm Password.
                                        </span>
                                   )}
                              </div>
                         </div>
                         <div className="flex justify-end gap-2">
                              <button
                                   type="button"
                                   onClick={() => {
                                        navigate("/dashboard/my-profile");
                                   }}
                                   className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                              >
                                   Cancel
                              </button>
                              <IconBtn type="submit" text="Update" />
                         </div>
                    </div>
               </form>
          </>
     );
};

export default ChangePassword;

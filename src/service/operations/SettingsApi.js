import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { SettingEndPoint } from "../apis";
import { resetCart } from "../../slices/cartSlice";
import { setToken } from "../../slices/authSlice";

const {
     UPDATE_PROFILE_PICTURE,
     DELETE_ACCOUNT,
     UPDATE_YOUR_PROFILE,
     CHANGE_PASSWORD,
} = SettingEndPoint;

export const changeProfilePicture = (token, formData) => {
     return async (dispatch) => {
          const existingData = JSON.parse(localStorage.getItem("user"));
          const toastId = toast.loading("Updating display picture...");
          try {
               const respons = await apiConnector(
                    "PUT",
                    UPDATE_PROFILE_PICTURE,
                    formData,
                    {
                         "Content-Type": "multipart/form-data",
                         Authorization: "Bearer " + token,
                    }
               );
               if (!respons.data.success) {
                    console.log(respons.data.message);
               }

               existingData.image = respons.data.data.image;
               localStorage.setItem("user", JSON.stringify(existingData));
               dispatch(setUser(respons.data.data));

               toast.success(respons?.data?.message);
          } catch (error) {
               toast.error(error.response.data.message);
          }
          setLoading(false);
          toast.dismiss(toastId);
     };
};

export const updateYourProfile = (token, data) => {
     console.log("data here => ", data);
     return async (dispatch) => {
          const toastId = toast.loading("Updating...");
          try {
               const respons = await apiConnector(
                    "PUT",
                    UPDATE_YOUR_PROFILE,
                    data,
                    {
                         Authorization: "Bearer " + token,
                    }
               );

               if (!respons.data.success) {
                    console.log(respons.data.message);
               }

               const imageSrc = respons.data.updateUserDetails.image
                    ? respons.data.updateUserDetails.image
                    : `https://api.dicebear.com/6.x/initials/svg?seed=${respons.data.updateUserDetails.firstName} ${respons.data.updateUserDetails.lastName}`;

               localStorage.setItem(
                    "user",
                    JSON.stringify(respons.data.updateUserDetails)
               );
               dispatch(
                    setUser({
                         ...respons.data.updateUserDetails,
                         image: imageSrc,
                    })
               );
               toast.success(respons.data.message);
          } catch (error) {
               toast.error(error.response.data.message);
          }
          toast.dismiss(toastId);
     };
};

export const changePassword = (token, formData, navigate) => {
     return async (dispatch) => {
          const toastId = toast.loading("Password updating...");
          try {
               const respons = await apiConnector(
                    "POST",
                    CHANGE_PASSWORD,
                    formData,
                    {
                         Authorization: `Bearer ${token}`,
                    }
               );

               if (!respons.data.success) {
                    console.log(respons.data.message);
               }
               toast.success(respons.data.message);
               navigate("/dashboard/my-profile");
          } catch (error) {
               toast.error(error.response.data.message);
          }
          toast.dismiss(toastId);
     };
};
export const deleteAccount = (token, navigate) => {
     return async (dispatch) => {
          const toastId = toast.loading("deleting your account..");
          try {
               const respons = await apiConnector(
                    "DELETE",
                    DELETE_ACCOUNT,
                    null,
                    {
                         Authorization: "Bearer " + token,
                    }
               );

               if (!respons.data.success) {
                    console.log(respons.data.message);
               }
               dispatch(setUser(null));
               dispatch(setToken(null));
               dispatch(resetCart());
               localStorage.removeItem("token");
               localStorage.removeItem("user");
               navigate("/");
               toast.success(respons.data.message);
          } catch (error) {
               toast.error(error.response.data.message);
          }
          toast.dismiss(toastId);
     };
};

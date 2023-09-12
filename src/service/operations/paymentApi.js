import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { PaymentEndpoint } from "../apis";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { PAYMENT_ORDER_API, PAYMENT_VERIFY_API, PAYMENT_SUCCESS_MAIL_SEND_API } =
     PaymentEndpoint;
const KEY = import.meta.env.VITE_REZORPAY_KEY;

const onLoadScript = (src) => {
     return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;

          script.onload = () => {
               resolve(true);
          };
          script.onerror = () => {
               resolve(false);
          };

          document.body.appendChild(script);
     });
};

export const buyCourse = async (token, courses, user, dispatch, navigate) => {
     const toastId = toast.loading("Loading...");
     try {
          const script = await onLoadScript(
               "https://checkout.razorpay.com/v1/checkout.js"
          );
          if (!script) {
               toast.error("Razorpay SDK load failed!");
               toast.dismiss(toastId);
               return;
          }

          const resposne = await apiConnector(
               "POST",
               PAYMENT_ORDER_API,
               { courses },
               { Authorization: "Bearer " + token }
          );

          // if response error
          if (!resposne.data.success) throw new Error(resposne.data.message);
          console.log(`PAYMENT ORDER API RESPONSE => `, resposne);

          const opations = {
               key: KEY,
               amount: resposne?.data?.data?.amount,
               currency: resposne?.data?.data?.currency,
               name: "StudyNotion",
               description: "Thank You for Purchasing the Course",
               image: rzpLogo,
               order_id: resposne?.data?.data?.id,
               handler: function (response) {
                    // verify payment
                    verifyPayment(
                         { ...response, courses },
                         token,
                         navigate,
                         dispatch
                    );
                    // send a mail when payment is success
                    paymentSuccessEmailSend(
                         response,
                         resposne?.data?.data?.amount,
                         token
                    );
               },
               prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    contact: user.additionalDetails.contactNumber || null,
               },
               theme: {
                    color: "#3399cc",
               },
          };

          const paymentObject = new window.Razorpay(opations);
          paymentObject.open();
          paymentObject.on(`payment.failed`, (resposne) => {
               toast.error(`oops!, Payment failed`);
               console.log(resposne.error);
          });
     } catch (error) {
          console.log(`PAYMENT API ERROR => `, error);
          toast.error(error.response.data.message);
     }

     toast.dismiss(toastId);
};

// verify payment
const verifyPayment = async (bodyData, token, navigate, dispatch) => {
     const toastId = toast.loading("verify payment...");
     dispatch(setPaymentLoading(true));
     try {
          // verify payment api call
          const response = await apiConnector(
               "POST",
               PAYMENT_VERIFY_API,
               bodyData,
               { Authorization: "Bearer " + token }
          );

          if (!response.data.success) {
               throw new Error(response.data.message);
          }
          toast.success("payment success...");
          navigate("/dashboard/enrolled-courses");
          dispatch(resetCart());
     } catch (error) {
          console.log(`VERIFY PAYMENT ERROR => `, error);
          toast.error(error.response.data.message);
     }
     toast.dismiss(toastId);
     dispatch(setPaymentLoading(false));
};

// send a message for successfully payment
const paymentSuccessEmailSend = async (response, amount, token) => {
     try {
          await apiConnector(
               "POST",
               PAYMENT_SUCCESS_MAIL_SEND_API,
               {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    amount: amount,
               },
               { Authorization: "Bearer " + token }
          );
     } catch (error) {
          console.log(`Mail Send Fail =>`, error);
     }
};

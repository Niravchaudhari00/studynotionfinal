import Razorpay from "razorpay";
import { config } from "dotenv";
config();

const instance = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export default instance;
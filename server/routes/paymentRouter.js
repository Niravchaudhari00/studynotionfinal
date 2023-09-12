import { Router } from "express";
import {
     capturePayment,
     mailSendForSuccessPayment,
     verifyPayment,
} from "../controllers/paymentsController.js";
import { Auth, isStudent } from "../middlewares/Auth.js";

const router = Router();
router.post("/caputer-payment", Auth, isStudent, capturePayment);
router.post("/verify-payment", Auth, isStudent, verifyPayment);
router.post(
     "/sendPaymentSuccessEmail",
     Auth,
     isStudent,
     mailSendForSuccessPayment
);
export default router;

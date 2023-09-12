import mongoose from "mongoose";
import instance from "../config/razorpay.js";
import Course from "../models/Course.js";
import { config } from "dotenv";
import crypto from "crypto";
import User from "../models/User.js";
import mailSender from "../utils/mailSend.js";

import CourseProgress from "../models/CourseProgress.js";
import courseEnrollmentEmail from "../mail/template/courseEnrollmentEmail.js";
import paymentRecievedTemplate from "../mail/template/paymentRecievedTemplate.js";
config();

export const capturePayment = async (req, res) => {
     const { courses } = req.body;
     console.log(`COURSES =>`, courses);
     const user_id = req.user.id;
     // check course
     if (courses.length === 0) {
          return res.status(400).json({
               success: false,
               message: `Please Provide The Course ID`,
          });
     }

     let totalAmount = 0;
     for (const course_id of courses) {
          let course;
          try {
               course = await Course.findById(course_id);

               if (!course) {
                    return res.status(404).json({
                         success: false,
                         message: "Course Could Not Found",
                    });
               }

               const userId = new mongoose.Types.ObjectId(user_id);
               if (course.studentsEnrolled.includes(userId)) {
                    return res.status(406).json({
                         success: false,
                         message: `You have already Enrolled this course`,
                    });
               }

               totalAmount += course.price;
          } catch (error) {
               console.log(`Error =>`, error);
               return res.status(500).json({
                    success: false,
                    message: error.message,
               });
          }
     }

     // Create a order
     try {
          const options = {
               amount: totalAmount * 100,
               currency: "INR",
               receipt: Math.random(Date.now()).toString(),
          };

          const paymentRespons = await instance.orders.create(options);
          console.log(`PAYMENT RESPONSE =>`, paymentRespons);
          return res.status(200).json({
               success: true,
               message: `capture payment is success`,
               data: paymentRespons,
          });
     } catch (error) {
          console.log(error);
          return res.status(500).json({
               success: false,
               message: `Could not initiate order.`,
          });
     }
};

// verify payment

export const verifyPayment = async (req, res) => {
     const razorpay_payment_id = req.body?.razorpay_payment_id;
     const razorpay_order_id = req.body?.razorpay_order_id;
     const razorpay_signature = req.body?.razorpay_signature;
     const courses = req.body?.courses;
     const user_id = req.user.id;
     if (
          !razorpay_payment_id ||
          !razorpay_order_id ||
          !razorpay_signature ||
          !courses ||
          !user_id
     ) {
          return res.status(400).json({
               status: false,
               message: `Payment Failed`,
          });
     }

     console.log("VERIFY PAYMENT CODE START");
     // verify payment
     let body = razorpay_order_id + "|" + razorpay_payment_id;
     console.log(`body =>`, body);
     const generated_signature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest("hex");

     if (generated_signature === razorpay_signature) {
          // enrolled student function
          await enrolledStudents(courses, user_id, res);

          // verify complate then return respons
          return res.status(200).json({
               success: true,
               message: `Payment Verifyed Successfully.`,
          });
     }

     return res.status(400).json({ status: false, message: `Payment Failed` });
};

// student enrolled funtion
const enrolledStudents = async (courses, userId, res) => {
     if (!courses || !userId) {
          return res.status(400).json({
               status: false,
               message: `Please Provide the all details`,
          });
     }

     for (const course_id of courses) {
          try {
               // pushe user id in courses model
               const courseEnrolled = await Course.findOneAndUpdate(
                    { _id: course_id },
                    { $push: { studentsEnrolled: userId } },
                    { new: true }
               );

               if (!courseEnrolled) {
                    return res.status(405).json({
                         status: false,
                         message: `Course Not Found.`,
                    });
               }
               console.log(`Course Enrolled : `, courseEnrolled);

               // course Progracess
               const courseProgress = await CourseProgress.create({
                    userId: userId,
                    courseId: course_id,
                    completeVideos: [],
               });

               const studentEnrolled = await User.findOneAndUpdate(
                    { _id: userId },
                    {
                         $push: {
                              courses: course_id,
                              courseProgress: courseProgress,
                         },
                    },
                    { new: true }
               );

               // validate
               if (!studentEnrolled) {
                    return res.status(405).json({
                         status: false,
                         message: `Failed Student Enrolle Update`,
                    });
               }

               console.log(`Enrolled Student : `, studentEnrolled);

               // sent message from user
               const sendMail = await mailSender(
                    studentEnrolled.email,
                    `Successfully Enrolled into ${courseEnrolled.courseName}`,
                    courseEnrollmentEmail(
                         courseEnrolled.courseName,
                         `${studentEnrolled.firstName} ${studentEnrolled.lastName}`
                    )
               );
               // Mail send user
               console.log(`mail send successfully : `, sendMail.response);
          } catch (error) {
               console.log(error);
               return res.status(400).json({
                    status: false,
                    message: error.message,
               });
          }
     }
};

// send a message for  payment successfully done

export const mailSendForSuccessPayment = async (req, res) => {
     const { orderId, paymentId, amount } = req.body;
     console.log(`orderId : `, orderId);
     console.log(`paymentid : `, paymentId);
     console.log(`amount : `, amount);
     const user_id = req.user.id;
     console.log(`useid :`, user_id);

     if (!orderId || !paymentId || !amount || !user_id) {
          return res.status(400).json({
               status: false,
               message: `Please Provide the all fields`,
          });
     }

     // send a mailSender
     try {
          const studentEnrolled = await User.findById(user_id);
          console.log(`student mail`, studentEnrolled.email);
          // send a mail
          const mailSend = await mailSender(
               studentEnrolled.email,
               `Payment Recieved`,
               paymentRecievedTemplate(
                    `${studentEnrolled.firstName} ${studentEnrolled.lastName}`,
                    amount / 100,
                    orderId,
                    paymentId
               )
          );

          // successfully send mail
          console.log(`mail send succfully : `, mailSend.response);
     } catch (error) {
          console.log(error);
          return res.status(400).json({
               status: false,
               message: error.message,
          });
     }
};

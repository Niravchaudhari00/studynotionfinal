import Course from "../models/Course.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import fileUploadOnCloudinary, {
     isFileTypeSupported,
} from "../utils/fileUploadOnCloudinary.js";
import { config } from "dotenv";
import convertSecondToDuration from "../utils/convertSecondToDuration.js";
import Section from "../models/Section.js";
import SubSection from "../models/SubSection.js";
import CourseProgress from "../models/CourseProgress.js";

config();

// Course create
export const createCourse = async (req, res) => {
     try {
          // Get the user id
          const userId = req.user.id;
          // fetch the data from req body
          let {
               courseName,
               courseDescription,
               whatYouWillLearn,
               price,
               category,
               tag: _tag,
               status,
               instructions: _instructions,
          } = req.body;

          const thumbnail = req.files.thumbnailImage;
          // Support file type
          const supportFileType = ["jpg", "jpeg", "png"];
          const fileType = thumbnail.name.split(".")[1].toLowerCase();
          if (!isFileTypeSupported(supportFileType, fileType)) {
               return res.status(401).json({
                    success: false,
                    message: `This file type can't supported. Only can support jpg,jpeg and png`,
               });
          }

          const tag = JSON.parse(_tag);
          const instructions = JSON.parse(_instructions);

          // all field are required
          if (
               !courseName ||
               !courseDescription ||
               !whatYouWillLearn ||
               !price ||
               !category ||
               !thumbnail ||
               !tag ||
               !instructions
          ) {
               return res.status(400).json({
                    success: false,
                    message: `All field are required. Please fill the all field`,
               });
          }

          // check status
          if (!status || status == undefined) {
               status = "Draft";
          }

          // Check the instructor details are available or not
          const isInstructor = await User.findById(userId, {
               accountType: "instruction",
          });

          if (!isInstructor) {
               return res.status(404).json({
                    success: false,
                    message: `Instructor details is not available`,
               });
          }

          // Check if the tag given is valid
          const isCategory = await Category.findById(category);
          if (!isCategory) {
               return res.status(404).json({
                    success: false,
                    message: `Category details not found`,
               });
          }

          // upload thumbnail in cloudinary
          const thumbnailImage = await fileUploadOnCloudinary(
               thumbnail,
               process.env.CLOUD_FOLDER_NAME
          );

          // create a course in db
          const saveCourse = await Course.create({
               instructor: isInstructor._id,
               courseName,
               courseDescription,
               whatYouWillLearn,
               price,
               tag,
               category: isCategory._id,
               thumbnail: thumbnailImage.secure_url,
               status: status,
               instructions,
          });

          // add the new couser in the user schema to Instructor
          await User.findByIdAndUpdate(
               { _id: isInstructor._id },
               {
                    $push: {
                         courses: saveCourse._id,
                    },
               },
               { new: true }
          );

          // add the new couser in the category schema
          await Category.findByIdAndUpdate(
               { _id: category },
               { $push: { courses: saveCourse._id } },
               { new: true }
          );

          // return respons
          return res.status(201).json({
               success: true,
               message: `Course created successfully`,
               data: saveCourse,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: `Failed to create course. Please try again`,
               error: error.message,
          });
     }
};

// edit course
export const editCourse = async (req, res) => {
     try {
          const { courseId } = req.body;
          const updates = req.body;
          const course = await Course.findById(courseId);
          if (!course) {
               return res.status(404).json({
                    success: false,
                    message: `Course Not Founds`,
               });
          }
          // Update only the fiels that are present in the reques body
          for (const key in updates) {
               if (updates.hasOwnProperty(key)) {
                    if (key === "tag" || key === "instructions") {
                         course[key] = JSON.parse(updates[key]);
                    } else {
                         course[key] = updates[key];
                    }
               }
          }
          console.log("course id", courseId);
          console.log("UPDATE DATA VALUE =>", updates);

          console.log("COURSE FILE =>", req.files);
          if (req.files) {
               const thumbnail = req.files.thumbnailImage;
               const supportFileType = ["jpg", "jpeg", "png"];
               const fileType = thumbnail.name.split(".")[1].toLowerCase();
               if (!isFileTypeSupported(supportFileType, fileType)) {
                    return res.status(401).json({
                         success: false,
                         message: `This file type can't supported. Only can support jpg,jpeg and png`,
                    });
               }
               const thumbnailImage = await fileUploadOnCloudinary(
                    thumbnail,
                    process.env.CLOUD_FOLDER_NAME
               );
               course.thumbnail = thumbnailImage.secure_url;
          }

          await course.save();

          const updateCourse = await Course.findOne({ _id: courseId })
               .populate({
                    path: "instructor",
                    populate: {
                         path: "additionalDetails",
                    },
               })
               .populate("category")
               .populate("ratingAndReview")
               .populate({
                    path: "courseContent",
                    populate: {
                         path: "subSection",
                    },
               })
               .exec();

          res.json({
               success: true,
               message: "Course updated successfully",
               data: updateCourse,
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: `Failed to edit course. Please try again`,
               error: error.message,
          });
     }
};
// Get all course
export const getAllCourses = async (req, res) => {
     try {
          //   todo : change the below statement incrementally
          const allCouser = await Course.find(
               { status: "Published" },
               {
                    courseName: true,
                    price: true,
                    instructor: true,
                    thumbnail: true,
                    ratingAndReview: true,
                    studentsEnrolled: true,
               }
          )
               .populate("instructor")
               .exec();
          // return respons
          return res.status(200).json({
               success: true,
               message: `showing all couseres`,
               data: allCouser,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: `Error occurred while fetching all courses. Please try again`,
               error: error.message,
          });
     }
};

// Get course Details
export const getCourseDetails = async (req, res) => {
     try {
          // Fetch the course id
          const { courseId } = req.body;
          // console.log(`course id -> ${courseId}`);
          const courseDetails = await Course.findOne({ _id: courseId })
               .populate({
                    path: "instructor",
                    populate: {
                         path: "additionalDetails",
                    },
               })
               .populate("category")
               .populate("ratingAndReview")
               .populate({
                    path: "courseContent",
                    populate: {
                         path: "subSection",
                         select: "-videoUrl",
                    },
               })
               .exec();

          if (!courseDetails) {
               return res.status(404).json({
                    success: false,
                    messaga: `Could not find course with id: ${courseId}`,
               });
          }

          let totalDurationInSecond = 0;
          courseDetails.courseContent.forEach((content) => {
               content.subSection.forEach((subSection) => {
                    const timeDurationInSecond = parseInt(
                         subSection.timeDuration
                    );
                    totalDurationInSecond += timeDurationInSecond;
               });
          });

          const totalDuration = convertSecondToDuration(totalDurationInSecond);
          // Return respons
          return res.status(200).json({
               success: true,
               messaga: `Course details fetched successfully.`,
               data: {
                    courseDetails,
                    totalDuration,
               },
          });
     } catch (error) {
          console.log(error.message);
          return res.status(500).json({
               success: false,
               messaga: `Error occurred while fetching the course details. Please try again`,
               error: error.message,
          });
     }
};

export const getFullCourseDetails = async (req, res) => {
     try {
          const { courseId } = req.body;
          const userId = req.user.id;

          const courseDetails = await Course.findOne({
               _id: courseId,
          })
               .populate({
                    path: "instructor",
                    populate: {
                         path: "additionalDetails",
                    },
               })
               .populate("category")
               .populate("ratingAndReview")
               .populate({
                    path: "courseContent",
                    populate: {
                         path: "subSection",
                    },
               })
               .exec();

          let courseProgressCount = await CourseProgress.findOne({
               courseId: courseId,
               userId: userId,
          });

          if (!courseDetails) {
               return res.status(400).json({
                    success: false,
                    message: `Could not find course with id: ${courseId}`,
               });
          }

          // if (courseDetails.status === "Draft") {
          //   return res.status(403).json({
          //     success: false,
          //     message: `Accessing a draft course is forbidden`,
          //   });
          // }

          let totalDurationInSeconds = 0;
          courseDetails.courseContent.forEach((content) => {
               content.subSection.forEach((subSection) => {
                    const timeDurationInSeconds = parseInt(
                         subSection.timeDuration
                    );
                    totalDurationInSeconds += timeDurationInSeconds;
               });
          });

          const totalDuration = convertSecondToDuration(totalDurationInSeconds);

          return res.status(200).json({
               success: true,
               data: {
                    courseDetails,
                    totalDuration,
                    completedVideos: courseProgressCount?.completeVideos
                         ? courseProgressCount?.completeVideos
                         : [],
               },
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: error.message,
          });
     }
};

export const getInstructorCourses = async (req, res) => {
     try {
          const instructorId = req.user.id;

          const instructorCourse = await Course.find({
               instructor: instructorId,
          }).sort({ createtAt: -1 });

          res.status(200).json({
               success: true,
               data: instructorCourse,
          });
     } catch (error) {
          res.status(500).json({
               success: false,
               message: "Failed to retrieve instructor courses",
               error: error.message,
          });
     }
};

export const deleteCourse = async (req, res) => {
     try {
          const { courseId } = req.body;

          const course = await Course.findById({ _id: courseId });
          if (!course) {
               return res.status(404).json({ message: "Course not found" });
          }
          // when you delete the course deleted the enrolled student
          const studentsEnrolled = course.studentsEnrolled;
          for (const studentId of studentsEnrolled) {
               await User.findByIdAndUpdate(studentId, {
                    $pull: { courses: courseId },
               });
          }

          // when you delete the course delete the section and sub section
          const courseSections = course.courseContent;
          for (const sectionId of courseSections) {
               // Delete sub-sections of the section
               const section = await Section.findById(sectionId);
               if (section) {
                    const subSections = section.subSection;
                    for (const subSectionId of subSections) {
                         await SubSection.findByIdAndDelete(subSectionId);
                    }
               }
               await Section.findByIdAndDelete(sectionId);
          }

          // when you delete the course delete the category
          const courseCategory = course.category;
          console.log(`courseCategory = `, courseCategory);
          await Course.findByIdAndDelete(courseId);

          res.status(200).json({
               success: true,
               message: `Course delete successfully.`,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: error.message,
          });
     }
};

import Section from "../models/Section.js";
import Course from "../models/Course.js";
import SubSection from "../models/SubSection.js";
// Create section
export const createSection = async (req, res) => {
     try {
          //fetch the data from req body
          const { sectionName, courseId } = req.body;
          if (!sectionName || !courseId) {
               return res.status(400).json({
                    success: false,
                    message: `All fiels are required. Please try again`,
               });
          }

          // Save section
          const newSection = await Section.create({ sectionName });

          //add the section in the course courseContent
          const updateCourse = await Course.findByIdAndUpdate(
               courseId,
               { $push: { courseContent: newSection._id } },
               { new: true }
          )
               .populate({ path: "courseContent" })
               .exec();
          // return respons
          return res.status(201).json({
               success: true,
               message: `Create section successfully`,
               data: updateCourse,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: `Error occurred while create a section. Please try again`,
               error: error.message,
          });
     }
};

// Update section
export const updateSection = async (req, res) => {
     try {
          // Fetch the data from req body
          const { sectionName, sectionId, courseId } = req.body;

          // Check section availeble or not
          const isSection = await Section.findById({ _id: sectionId });
          if (!isSection) {
               return res.status(404).json({
                    success: false,
                    message: `Section Details Not Found`,
               });
          }
          // Update sectionName
          await Section.findByIdAndUpdate(
               { _id: isSection._id },
               { sectionName: sectionName },
               { new: true }
          );

          const course = await Course.findById(courseId).populate({
               path: "courseContent",
               populate: {
                    path: "subSection",
               },
          });
          // return respons
          return res.status(201).json({
               success: true,
               message: `Update section successfully`,
               data: course,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: `Unable to update section. Please try again`,
               error: error.message,
          });
     }
};

// delete section
export const sectionDelete = async (req, res) => {
     try {
          const { sectionId, courseId } = req.body;
          await Course.findByIdAndUpdate(courseId, {
               $pull: {
                    courseContent: sectionId,
               },
          });

          const section = await Section.findById({ _id: sectionId });
          if (!section) {
               return res.status(405).json({
                    success: false,
                    message: `Section Not Found`,
               });
          }
          await SubSection.deleteMany({ _id: { $in: section.subSection } });
          await Section.findByIdAndDelete({ _id: sectionId });

          const course = await Course.findById(courseId)
               .populate({
                    path: "courseContent",
                    populate: {
                         path: "subSection",
                    },
               })
               .exec();

          return res.status(200).json({
               success: true,
               message: `Section Delete Successfully`,
               data: course,
          });
     } catch (error) {
          return res.status(500).json({
               success: false,
               message: `Unable to delete section. Please try again`,
               error: error.message,
          });
     }
};

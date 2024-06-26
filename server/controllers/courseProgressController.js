import CourseProgress from "../models/CourseProgress.js";
import SubSection from "../models/SubSection.js";

const updateCourseProgress = async (req, res) => {
     try {

          const { courseId, subSectionId } = req.body;
          const userId = req.user.id;

          const subSection = await SubSection.findById({ _id: subSectionId });

          if (!subSection) {
               res.status(404).json({ error: `Invalid subsection` });
          }

          const courseProgress = await CourseProgress.findOne({
               courseId: courseId,
               userId: userId,
          });

          if (!courseProgress) {
               res.status(404).json({
                    success: true,
                    message: `Course progress does not exist`,
               });
          } else {
               if (courseProgress.completeVideos.includes(subSectionId)) {
                    return res.status(400).json({
                         error: `Lecture already complated`,
                    });
               }

               courseProgress.completeVideos.push(subSectionId);
          }

          await courseProgress.save();

          return res.status(200).json({
               success: true,
               message: "Course progress updated",
          });
     } catch (error) {
          console.log(error)
          return res.status(200).json({
               success: false,
               message: error.message,
          });
     }
};

export default updateCourseProgress;

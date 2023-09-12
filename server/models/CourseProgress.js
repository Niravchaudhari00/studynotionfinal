import { Schema, model } from "mongoose";

const courseProgressSchema = new Schema({
     courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
     },
     userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
     },
     completeVideos: [
          {
               type: Schema.Types.ObjectId,
               ref: "SubSection",
          },
     ],
});

export default model("CourseProgress", courseProgressSchema);

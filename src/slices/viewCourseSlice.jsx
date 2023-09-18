import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     courseSectionData: [],
     courseEntireData: [],
     complateLectureData: [],
     totalNoOfLectures: 0,
};

export const viewCourseSlice = createSlice({
     name: "viewCourse",
     initialState,
     reducers: {
          setCourseSectionData: (state, action) => {
               state.courseSectionData = action.payload;
          },
          setCourseEntireData: (state, action) => {
               state.courseEntireData = action.payload;
          },

          setCotalNoOfLectures: (state, action) => {
               state.complateLectureData = action.payload;
          },
          setComplateLectureData: (state, action) => {
               state.complateLectureData = action.payload;
          },
          updatecomplateLectureData: (state, action) => {
               state.complateLectureData = [
                    ...state.complateLectureData,
                    action.payload,
               ];
          },
     },
});
export const {
     setComplateLectureData,
     setCotalNoOfLectures,
     setCourseEntireData,
     setCourseSectionData,
     updatecomplateLectureData,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;

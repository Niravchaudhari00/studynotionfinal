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

          setTotalNoOfLectures: (state, action) => {
               state.totalNoOfLectures = action.payload;
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
     setTotalNoOfLectures,
     setCourseEntireData,
     setCourseSectionData,
     updatecomplateLectureData,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;

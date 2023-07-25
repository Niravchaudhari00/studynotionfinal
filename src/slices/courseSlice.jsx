import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     step: 1,
     course: null,
     editCourse: false,
     paymatLoading: false,
};

const courseSlice = createSlice({
     name: "course",
     initialState,
     reducers: {
          setStep: (state, action) => {
               state.value = action.payload;
          },
          setCourse: (state, action) => {
               state.value = action.payload;
          },
          setEditCourse: (state, action) => {
               state.value = action.payload;
          },
          setPaymentLoading: (state, action) => {
               state.value = action.payload;
          },
          resetCourseState: (state) => {
               state.step = 1;
               state.course = null;
               state.editCourse = false;
          },
     },
});

export const { setStep, setCourse, setEditCourse, setPaymentLoading } =
     courseSlice.actions;
export default courseSlice.reducer;

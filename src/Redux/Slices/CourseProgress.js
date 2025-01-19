import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  courseProgress: [],
};

export const activateCourseForUser = createAsyncThunk(
  '/course-progress',
  async (data) => {
    try {
      const response = axiosInstance.post('/userProgress/active', data);
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const courseProgressSlice = createSlice({
  name: 'courseProgress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(activateCourseForUser.fulfilled, (state, action) => {
      if (action.payload) {
        //   state.courseData = [...action.payload];
      }
    });
  },
});

export default courseProgressSlice.reducer;

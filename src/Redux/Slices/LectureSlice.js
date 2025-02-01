import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  lectures: {
    completedLectures: 0,
    totalLectures: 0,
  },
};

export const getCourseLectures = createAsyncThunk(
  'course/getCourseLectures',
  async ({ courseId, lectureId }) => {
    try {
      const response = axiosInstance.get(
        `/course/${courseId}/lectures/${lectureId}`
      );
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const addCourseLectures = createAsyncThunk(
  'course/addCourseLectures',
  async (data) => {
    try {
      const fromData = new FormData();
      fromData.append('lecture', data.lecture);
      fromData.append('title', data.title);
      fromData.append('description', data.description);

      const response = axiosInstance.post(`/course/${data.id}`, fromData);
      toast.promise(response, {
        loading: 'Adding course lecture',
        success: 'Lectures added successfully',
        error: 'Failed to add the lectures',
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourseLecture = createAsyncThunk(
  '/course/lecture/delete',
  async (data) => {
    try {
      const response = axiosInstance.delete(
        `/course/${data.courseId}/lectures/${data.lectureId}`
      );
      toast.promise(response, {
        loading: 'Delete course lecture',
        success: 'Lecture delete successfully',
        error: 'Failed to delete the lectures',
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const unlockNextLecture = createAsyncThunk(
  'lecture/unlockNextLecture',
  async ({ courseId, lectureId, preLectureId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/userProgress/updateLecture', {
        courseId,
        lectureId,
        preLectureId,
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra!');
      return rejectWithValue(error?.response?.data);
    }
  }
);

const lectureSlice = createSlice({
  name: 'lecture',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lecture;
      })
      .addCase(addCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures;
      })
      .addCase(unlockNextLecture.fulfilled, (state, action) => {
        const preLectureId = action?.payload?.data?.preLectureId;
        const lectureId = action?.payload?.data?.lectureId;

        if (
          !state.lectures?.courseContent ||
          !Array.isArray(state.lectures.courseContent)
        ) {
          console.error('Invalid courseContent:', state.lectures.courseContent);
          return;
        }

        const index = state.lectures.courseContent.findIndex(
          (item) => item.id === preLectureId
        );

        const indexLectureNext = state.lectures.courseContent.findIndex(
          (item) => item.id === lectureId
        );

        if (index !== -1) {
          state.lectures.courseContent[index].completed = true;
          state.lectures.completedLectures += 1;
        } else {
          console.warn(`Lecture with ID ${preLectureId} not found.`);
        }
        if (indexLectureNext !== -1) {
          state.lectures.courseContent[indexLectureNext].locked = false;
        } else {
          console.warn(`Lecture with ID ${preLectureId} not found.`);
        }
      });
  },
});

export const { updateLecture } = lectureSlice.actions;

export default lectureSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  courseData: [],
  activeCourses: [],
  inactiveCourses: [],
  courseWithUser: [],
};

export const getAllCourse = createAsyncThunk('/course/get', async () => {
  try {
    const response = axiosInstance.get('/course');
    return (await response).data.courses;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getAllCourseUser = createAsyncThunk('/course/user', async () => {
  try {
    const response = axiosInstance.get('/course/user');
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getCoursesWithUsers = createAsyncThunk(
  'course/getCoursesWithUsers',
  async () => {
    try {
      const response = axiosInstance.get('/course/getCoursesWithUsers');
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const createNewCourse = createAsyncThunk(
  'course/createNewCourse',
  async (data) => {
    try {
      let formData = new FormData();
      formData.append('title', data?.title);
      formData.append('description', data?.description);
      formData.append('category', data?.category);
      formData.append('createdBy', data?.createdBy);
      formData.append('thumbnail', data?.thumbnail);
      formData.append('oldPrice', data?.oldPrice);
      formData.append('price', data?.price);

      const response = axiosInstance.post('/course', formData);

      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourse = createAsyncThunk('/course/delete', async (id) => {
  try {
    const response = axiosInstance.delete(`/course/${id}`);
    toast.promise(response, {
      loading: 'deleting course data ...',
      success: 'course deleted sucessfully',
      error: 'Failed to delete the course',
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const updateCourse = createAsyncThunk('/course/update', async (data) => {
  try {
    // creating the form data from user data
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('createdBy', data.createdBy);
    formData.append('description', data.description);
    formData.append('oldPrice', data.oldPrice);
    formData.append('price', data.price);
    console.log({ data });
    // backend is not allowing change of thumbnail
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    const res = axiosInstance.put(`/course/${data.id}`, {
      title: data.title,
      category: data.category,
      createdBy: data.createdBy,
      description: data.description,
      oldPrice: data?.oldPrice,
      price: data?.price,
    });

    toast.promise(res, {
      loading: 'Updating the course...',
      success: 'Course updated successfully',
      error: 'Failed to update course',
    });

    const response = await res;
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourse.fulfilled, (state, action) => {
        if (action.payload) {
          state.courseData = [...action.payload];
        }
      })
      .addCase(getAllCourseUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeCourses = [...action.payload.data.activeCourses];
          state.inactiveCourses = [...action.payload.data.inactiveCourses];
        }
      })
      .addCase(getCoursesWithUsers.fulfilled, (state, action) => {
        if (action.payload) {
          state.courseWithUser = [...action.payload.result];
        }
      });
  },
});

export default courseSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  userData: [],
};

export const getAllUser = createAsyncThunk('user/getAll', async () => {
  try {
    const response = axiosInstance.get('user/getAll');
    toast.promise(response, {
      loading: 'loading user data ...',
      success: 'users loaded successfully',
      error: 'Failed to get the users',
    });
    return (await response).data.users;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.userData = [...action.payload];
      }
    });
  },
});

export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state, action) => {
        const feature = action.type.split('/')?.[0];
        const actionName = action.type.split('/')?.[1];
        state[feature] = {
          ...state[feature],
          [actionName]: {
            status: 'pending',
            error: null,
          },
        };
      }
    );
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state, action) => {
        const feature = action.type.split('/')?.[0];
        const actionName = action.type.split('/')?.[1];
        state[feature] = {
          ...state[feature],
          [actionName]: {
            status: 'fulfilled',
            error: null,
          },
        };
      }
    );
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        const feature = action.type.split('/')?.[0];
        const actionName = action.type.split('/')?.[1];
        state[feature] = {
          ...state[feature],
          [actionName]: {
            status: 'rejected',
            error: action.payload,
          },
        };
      }
    );
  },
});

export default apiSlice.reducer;

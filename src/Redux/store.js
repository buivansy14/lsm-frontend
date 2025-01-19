import { configureStore } from '@reduxjs/toolkit';

import ApiSlice from './Slices/ApiSlice';
import AuthSliceReducer from './Slices/AuthSlice';
import CourseProgress from './Slices/CourseProgress';
import CourseSliceReducer from './Slices/CourseSlice';
import LecturesReducer from './Slices/LectureSlice';
import RazorpayReducer from './Slices/RazorpaySlice';
import StatReducer from './Slices/StatSlice';
import UserSlice from './Slices/UserSlice';

const store = configureStore({
  reducer: {
    auth: AuthSliceReducer,
    course: CourseSliceReducer,
    razorpay: RazorpayReducer,
    lecture: LecturesReducer,
    stat: StatReducer,
    progress: CourseProgress,
    user: UserSlice,
    apiSlice: ApiSlice,
  },
  devTools: true,
});
export default store;

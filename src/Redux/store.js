import { configureStore } from '@reduxjs/toolkit';

import ApiSlice from './Slices/ApiSlice';
import AuthSliceReducer from './Slices/AuthSlice';
import CourseProgress from './Slices/CourseProgress';
import CourseSliceReducer from './Slices/CourseSlice';
import LecturesReducer from './Slices/LectureSlice';
import PaymentSlice from './Slices/PaymentSlice';
import StatReducer from './Slices/StatSlice';
import UserSlice from './Slices/UserSlice';

const store = configureStore({
  reducer: {
    auth: AuthSliceReducer,
    course: CourseSliceReducer,
    lecture: LecturesReducer,
    stat: StatReducer,
    progress: CourseProgress,
    user: UserSlice,
    apiSlice: ApiSlice,
    payment: PaymentSlice,
  },
  devTools: true,
});
export default store;

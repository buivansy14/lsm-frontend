import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
  totalRevenue: 0,
};

export const getPaymentRecord = createAsyncThunk(
  'getPaymentRecord',
  async () => {
    try {
      const response = axiosInstance.get('/payment/getAllPayment?count=100');
      return (await response).data;
    } catch (error) {
      toast.error('Operation failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPaymentRecord.fulfilled, (state, action) => {
      state.allPayments = action?.payload?.allPayments;
      state.finalMonths = action?.payload?.finalMonths;
      state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      state.totalRevenue = action?.payload?.totalRevenue;
    });
  },
});

export default paymentSlice.reducer;

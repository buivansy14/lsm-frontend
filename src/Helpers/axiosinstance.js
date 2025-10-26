import axios from 'axios';

import { hideLoading, showLoading } from './loadingManager';

export const BASE_URL = 'https://api.course.techonline.edu.vn/api/v1';
// export const BASE_URL = 'http://localhost:8080/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let requestCount = 0;

const startLoading = () => {
  if (requestCount === 0) showLoading();
  requestCount++;
};

const stopLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    hideLoading();
    requestCount = 0;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.showLoading !== false) {
      startLoading();
    }
    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.showLoading !== false) {
      stopLoading();
    }
    return response;
  },
  (error) => {
    if (error.config.showLoading !== false) {
      stopLoading();
    }
    if (error.response?.status === 403) {
      window.location.href = '/denied';
    }
    if (error.response?.status === 404) {
      window.location.href = '/not-found';
    }
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

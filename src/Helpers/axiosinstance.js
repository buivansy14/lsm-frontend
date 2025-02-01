import axios from 'axios';

const BASE_URL = 'https://api.course.hoclaptrinh.tokyo/api/v1';
// const BASE_URL = 'http://localhost:8080/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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

import axios from 'axios';

import { hideLoading, showLoading } from './loadingManager';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.course.techonline.edu.vn/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 45000, // Cho phép tối đa 45s để server Render khởi động hoàn tất
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

// Request Interceptor
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

// Response Interceptor với cơ chế Tự động Thử lại (Auto-Retry cho Render Cold Start)
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.showLoading !== false) {
      stopLoading();
    }
    return response;
  },
  async (error) => {
    const config = error.config;

    // Các mã lỗi thường gặp khi Render đang khởi động hoặc mạng chập chờn
    const isColdStartError =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      [502, 503, 504].includes(error.response?.status);

    // Cấu hình tối đa 3 lần thử lại (khoảng cách 2.5s -> 4s -> 5.5s)
    if (config && isColdStartError && (config.__retryCount || 0) < 3) {
      config.__retryCount = (config.__retryCount || 0) + 1;
      const delayMs = config.__retryCount * 2000;

      console.warn(
        `[Render Cold Start] Đang thử kết nối lại máy chủ (Lần ${config.__retryCount}/3 sau ${delayMs}ms)...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return axiosInstance(config);
    }

    if (config?.showLoading !== false) {
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

/**
 * Âm thầm gửi 1 request nhẹ để đánh thức Render Server ngay khi ứng dụng khởi động
 */
export const warmUpServer = async () => {
  try {
    const rootUrl = BASE_URL.replace('/api/v1', '');
    await axios.get(`${rootUrl}/ping`, {
      timeout: 30000,
      showLoading: false,
    });
    console.log('⚡ [Warmup] Máy chủ đã sẵn sàng hoạt động.');
  } catch (err) {
    // Không ném lỗi nếu ping thất bại trong nền
    console.log('⚡ [Warmup] Đang gửi tín hiệu khởi động máy chủ Render...');
  }
};

export default axiosInstance;

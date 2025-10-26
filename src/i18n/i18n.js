import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { BASE_URL } from '../Helpers/axiosinstance';

// Kiểm tra ngôn ngữ đã lưu
const savedLanguage = localStorage.getItem('language');

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    lng: savedLanguage || undefined, // Nếu có giá trị trong localStorage, sử dụng nó
    backend: {
      loadPath: `${BASE_URL}/translation/get-translations-i18n/{{lng}}`,
      parse: (data) => {
        const json = JSON.parse(data);
        return json.data || {}; // Lấy dữ liệu từ `data`
      },
    },
    detection: {
      order: ['localStorage', 'navigator'], // Ưu tiên localStorage, sau đó trình duyệt
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

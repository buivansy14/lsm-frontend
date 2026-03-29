import { BASE_URL } from './axiosinstance';

export const getImageUrl = (secureUrl) => {
  if (secureUrl && secureUrl.startsWith('/uploads')) {
    return `${BASE_URL.replace('/api/v1', '')}${secureUrl}`;
  }
  return secureUrl;
};
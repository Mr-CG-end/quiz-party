import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等逻辑
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // Apifox Mock 返回的数据在 response.data 中
    return response.data;
  },
  (error) => {
    console.error('API 请求出错:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default request;

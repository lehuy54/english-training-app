// utils/axiosConfig.ts
import axios from "axios";
import { store } from '../store';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Interceptor để đính kèm token xác thực vào mỗi request
apiClient.interceptors.request.use((config) => {
  console.log('\n====== AXIOS INTERCEPTOR ======');
  // Thử lấy token từ Redux store trước
  const state = store.getState();
  const reduxToken = state.auth.token;
  console.log('Token from Redux:', reduxToken ? 'Available' : 'Not available');
  
  // Nếu không có trong Redux, thử lấy từ localStorage
  const localToken = localStorage.getItem("token");
  console.log('Token from localStorage:', localToken ? 'Available' : 'Not available');
  
  // Sử dụng token từ Redux hoặc localStorage
  const token = reduxToken || localToken;
  console.log('Final token used:', token ? `${token.substring(0, 15)}...` : 'No token available');
  console.log(`Request to: ${config.baseURL}${config.url}`);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set');
  } else {
    console.log('No Authorization header set - token missing');
  }
  console.log('==============================\n');
  
  return config;
});

export default apiClient;
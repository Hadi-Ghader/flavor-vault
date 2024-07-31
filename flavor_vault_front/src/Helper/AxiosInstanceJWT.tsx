import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

const instanceJwt = axios.create({
  baseURL: 'https://localhost:7126/api/',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instanceJwt.interceptors.request.use(
  (config) => {
    const token = secureLocalStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instanceJwt;
// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-gateway-14jr.onrender.com', // el API Gateway
});

export default api;

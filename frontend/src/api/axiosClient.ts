import axios from 'axios';

const axiosClient = axios.create({
  // Use same-origin API path. In dev, Vite proxies `/api` to the gateway on `localhost:8080`.
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosClient;

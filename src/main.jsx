import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import AppRoutes from './routes/AppRoutes'

// --- AXIOS CONFIGURATION START ---

// 1. REQUEST INTERCEPTOR: Attach the token to every outgoing request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Handle expired tokens or server errors globally
axios.interceptors.response.use(
  (response) => response, // If the request succeeds, just return the response
  (error) => {
    // If the server sends 401 (Unauthorized), it means the JWT is expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.clear(); // Wipe the token and user data
      window.location.href = '/login'; // Force redirect to login
    }
    return Promise.reject(error);
  }
);

// --- AXIOS CONFIGURATION END ---

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001',
});

// Attach token for each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const registerUser = (userData) => API.post('api/auth/register', userData);
export const loginUser = (userData) => API.post('api/auth/login', userData);

// Employee - Based on your actual routes
export const submitExitProcess = (data) => API.post('/api/employee/resign', data);
export const getMyExitRequests = () => API.get('/api/employee/response');



// Admin

export const getAllExitRequests = () => API.get('/api/hr/exit-requests');
export const getExitRequest = (id) => API.get(`/api/hr/exit-request/${id}`);
export const approveExitRequest = (id) => API.put(`/api/hr/exit-request/${id}/approve`);
export const rejectExitRequest = (id, remarks) => API.put(`/api/hr/exit-request/${id}/reject`, { remarks });


export default API;
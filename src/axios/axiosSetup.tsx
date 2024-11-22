import axios from "axios";


//use https for productions
const baseURL = process.env.NODE_ENV === 'production' ? 'https:/studybuddy-production-1dcc.up.railway.app' : 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: baseURL,
});


// Add a request interceptor to the axios instance to attach the token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
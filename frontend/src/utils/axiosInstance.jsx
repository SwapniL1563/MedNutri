import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

// attach header to req with token
axiosInstance.interceptors.request.use( config => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}
)

axiosInstance.interceptors.response.use(
    res => res,
    async err => {
        const originalReq = err.config;

        // if access token expires
        if(err.response?.status === 403 && !originalReq._retry) {
            originalReq._retry = true;
            try {
            const res = await axiosInstance.get("/api/auth/refresh-token");
            const newToken = res.data.token;
            localStorage.setItem('token',newToken);
            originalReq.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalReq);
 
            } catch (refError) {
            // if refresh token expires
            localStorage.removeItem('token');
            window.location.href = '/signin'
            toast.error("Session expired. Please sign in again.");
            return Promise.reject(refError)
            } }

        return Promise.reject(err);
    }
)

export default axiosInstance;
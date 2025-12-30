import axios from 'axios';

// Replace with your actual API URL
const BASE_URL = 'https://waterpaid-api.onrender.com';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get cookie by name (simple version for client-side)
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

// Interceptor to add token to requests
client.interceptors.request.use(async (config) => {
    // In Next.js, we might store token in cookies or localStorage
    // Using localStorage for parity with Mobile App logic for now, 
    // unless user prefers HttpOnly cookies (more secure).
    // Given the prompt asked for "same style/logic", localStorage/Cookies accessible via JS is easiest to port.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Types based on API schemas
export interface AdminLoginRequest {
    username: string; // The API uses OAuth2PasswordRequestForm usually, but let's check auth.py
    password: string;
}

export const authApi = {
    login: (data: any) => client.post('/auth/login', data),
};

export const adminApi = {
    getMeters: () => client.get('/a/meters'),
    createMeter: (data: any) => client.post('/a/meters', data),
    getMeter: (id: string) => client.get(`/a/meters/${id}`),
    updateMeter: (id: string, data: any) => client.put(`/a/meters/${id}`, data),
    deleteMeter: (id: string) => client.delete(`/a/meters/${id}`),

    linkDevice: (id: string, dev_eui: string) => client.post(`/a/meters/${id}/link-device`, null, { params: { dev_eui } }),

    getUsers: (skip = 0, limit = 100) => client.get('/a/users', { params: { skip, limit } }),

    getReports: (params: any) => client.get('/a/reports', { params }),
    createReport: (data: any) => client.post('/a/reports', data),

    // Refill Meter by Admin
    refillMeter: (id_meter: string, data: any) => client.post(`/a/refill-meters/${id_meter}`, data),
};

export default client;

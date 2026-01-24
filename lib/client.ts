import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
    Meter,
    CreateMeterRequest,
    UpdateMeterRequest,
    User,
    Transaction,
    Report,
    ReportParams,
    ReportCreateRequest,
    RefillMeterRequest,
    MeterTokenResponse,
} from '@/types/api';

// Utilisation de la variable d'environnement
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://waterpaid-api.onrender.com';

// Client Axios pour les requêtes depuis le navigateur
const browserClient: AxiosInstance = axios.create({
    baseURL: '/api', // Proxy via les routes API Next.js
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important pour envoyer les cookies HttpOnly
});

// Client Axios pour les requêtes serveur-side
export const serverClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour gérer les erreurs de manière uniforme
browserClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Redirection automatique vers login si non authentifié
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

// ========================================
// API Admin - Requêtes typées strictement
// ========================================

export const adminApi = {
    // Meters
    getMeters: () => browserClient.get<Meter[]>('/admin/meters'),

    createMeter: (data: CreateMeterRequest) =>
        browserClient.post<Meter>('/admin/meters', data),

    getMeter: (id: string) =>
        browserClient.get<Meter>(`/admin/meters/${id}`),

    updateMeter: (id: string, data: UpdateMeterRequest) =>
        browserClient.put<Meter>(`/admin/meters/${id}`, data),

    deleteMeter: (id: string) =>
        browserClient.delete<void>(`/admin/meters/${id}`),

    generateMeterToken: (id: string) =>
        browserClient.post<MeterTokenResponse>(`/admin/meters/${id}/generate-token`),

    linkDevice: (id: string, dev_eui: string) =>
        browserClient.post<void>(`/admin/meters/${id}/link-device`, { dev_eui }),

    // Users
    getUsers: (skip = 0, limit = 100) =>
        browserClient.get<User[]>('/admin/users', { params: { skip, limit } }),

    // Reports
    getReports: (params: ReportParams) =>
        browserClient.get<Report[]>('/admin/reports', { params }),

    createReport: (data: ReportCreateRequest) =>
        browserClient.post<Report>('/admin/reports', data),

    // Refill Meter
    refillMeter: (id_meter: string, data: RefillMeterRequest) =>
        browserClient.post<Transaction>(`/admin/refill-meters/${id_meter}`, data),

    // History
    getTransactionHistory: (params: { user_id?: string; meter_id?: string }) =>
        browserClient.get<Transaction[]>('/admin/histories', { params }),
};

export default browserClient;

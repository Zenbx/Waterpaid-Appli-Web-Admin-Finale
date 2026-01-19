// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    detail: string;
    status?: number;
}

// ========================================
// Auth Types
// ========================================

export interface LoginRequest {
    phone: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

// ========================================
// User Types
// ========================================

export interface User {
    user_id: string;
    user_pseudo: string;
    user_phone: string;
    user_email: string | null;
    created_at: string;
    updated_at: string;
}

// ========================================
// Meter Types
// ========================================

export type MeterState = 'ON' | 'OFF';

export interface Meter {
    meter_id: string;
    serial_id: string;
    device_id: string | null;
    attributed: boolean;
    meter_state: MeterState;
    User?: {
        user_id: string;
        user_pseudo: string;
        user_phone: string;
    } | null;
    created_at: string;
    updated_at: string;
}

export interface CreateMeterRequest {
    serial_id: string;
    device_id?: string;
}

export interface UpdateMeterRequest {
    serial_id?: string;
    device_id?: string;
    meter_state?: MeterState;
}

export interface LinkDeviceRequest {
    dev_eui: string;
}

// ========================================
// Transaction Types
// ========================================

export type PaymentMethod = 'MOMO' | 'ORANGE_MONEY' | 'CASH';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
    transaction_id: string;
    user_id: string;
    meter_id: string;
    amount: number;
    volume_liters: number;
    payment_method: PaymentMethod;
    status: TransactionStatus;
    created_at: string;
}

export interface RefillMeterRequest {
    amount: number;
    volume_liters: number;
    payment_method: PaymentMethod;
}

// ========================================
// Report Types
// ========================================

export interface ReportParams {
    start_date?: string;
    end_date?: string;
    meter_id?: string;
    user_id?: string;
}

// Shared Types for WaterPaid Admin

export interface User {
    id: string;
    phone_number: string;
    pseudo: string;
    user_type: 'user' | 'admin';
    email?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Meter {
    id_meter: string;
    location?: string;
    is_active: boolean;
    current_balance: number;
    max_balance: number;
    created_at: string;
    updated_at: string;
}

export interface Refill {
    refill_id: string;
    id_meter: string;
    price: number;
    volume: number;
    payment_method: 'orange_money' | 'mtn_momo' | 'cash' | 'card';
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    transaction_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Interaction {
    interaction_id: string;
    id_meter: string;
    user_id: string;
    interaction_type: 'refill' | 'consumption' | 'maintenance' | 'alert';
    description: string;
    created_at: string;
}

export interface DashboardData {
    user: User;
    meters: Meter[];
    recent_refills: Refill[];
    total_spent: number;
    active_meters: number;
    current_balance: number;
    consumption_this_month: number;
}

export interface ApiError {
    code: string;
    message: string;
    statusCode: number;
    details?: any;
}

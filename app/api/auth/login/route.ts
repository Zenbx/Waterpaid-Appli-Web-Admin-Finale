import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { LoginRequest, LoginResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://waterpaid-api.onrender.com';
const TOKEN_EXPIRY = parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY || '30'); // minutes

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json();

        // Validation basique
        if (!body.phone || !body.password) {
            return NextResponse.json(
                { detail: 'Phone and password are required' },
                { status: 400 }
            );
        }

        // Appel à l'API backend
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
            return NextResponse.json(
                { detail: error.detail || 'Invalid credentials' },
                { status: response.status }
            );
        }

        const data: LoginResponse = await response.json();

        // Stocker le token dans un cookie HttpOnly sécurisé
        const cookieStore = await cookies();
        cookieStore.set('auth-token', data.access_token, {
            httpOnly: true, // Protection XSS
            secure: process.env.NODE_ENV === 'production', // HTTPS seulement en prod
            sameSite: 'lax', // Protection CSRF
            maxAge: TOKEN_EXPIRY * 60, // Conversion en secondes
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Login API Error]:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { detail: 'An error occurred during login' },
            { status: 500 }
        );
    }
}

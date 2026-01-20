import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://waterpaid-api.onrender.com';

async function proxyRequest(request: NextRequest, method: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json(
                { detail: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Extraire le path depuis l'URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/api/admin/');
        const apiPath = pathSegments[1] || '';

        // Construire l'URL complète vers le backend
        const backendUrl = `${API_BASE_URL}/a/${apiPath}${url.search}`;

        // Préparer les options de la requête
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        // Ajouter le body pour les requêtes POST, PUT, PATCH
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            const body = await request.text();
            if (body) {
                options.body = body;
            }
        }

        // Faire la requête vers le backend
        const response = await fetch(backendUrl, options);

        // Récupérer le contenu de la réponse
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // Retourner la réponse avec le même status code
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[Admin API Proxy Error]:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { detail: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
    return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
    return proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
    return proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
    return proxyRequest(request, 'DELETE');
}

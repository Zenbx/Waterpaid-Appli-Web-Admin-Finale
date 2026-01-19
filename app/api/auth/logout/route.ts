import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('auth-token');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Logout API Error]:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { detail: 'An error occurred during logout' },
            { status: 500 }
        );
    }
}

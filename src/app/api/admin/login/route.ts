import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return NextResponse.json(
            { error: 'Admin password not configured on server' },
            { status: 500 }
        );
    }

    if (password === adminPassword) {
        const response = NextResponse.json({ success: true });

        // Set a simple cookie for session management
        // In production, use a more secure JWT-based approach
        response.cookies.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

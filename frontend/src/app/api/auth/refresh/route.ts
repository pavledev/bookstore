import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import api from '@/utils/axios';
import { AxiosError } from "axios";

export const POST = async () =>
{
    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get('refreshToken')?.value;

    if (!oldRefreshToken)
    {
        return NextResponse.json({ message: 'Nedostaje refresh token.' }, { status: 401 });
    }

    try
    {
        const response = await api.post('/auth/refresh', { refreshToken: oldRefreshToken });
        const { accessToken, refreshToken } = response.data;

        cookieStore.set({
            name: 'accessToken',
            value: accessToken,
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 15
        });

        cookieStore.set({
            name: 'refreshToken',
            value: refreshToken,
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.json({ accessToken });
    }
    catch (error: unknown)
    {
        const err = error as AxiosError;
        const message = err.response?.data || 'Neuspešno osvežavanje tokena.';

        return NextResponse.json({ message }, { status: 401 });
    }
}

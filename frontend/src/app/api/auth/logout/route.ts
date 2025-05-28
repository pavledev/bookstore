import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import api from '@/utils/axios';
import { AxiosError } from "axios";

export const POST = async () =>
{
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken)
    {
        return NextResponse.json({ message: 'Nema aktivnog tokena.' }, { status: 200 });
    }

    try
    {
        await api.post('/auth/logout', {}, { withCredentials: true });

        const response = NextResponse.json({ message: 'Odjavljeni ste.' });

        cookieStore.set({
            name: 'accessToken',
            value: '',
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
            maxAge: 0
        });

        cookieStore.set({
            name: 'refreshToken',
            value: '',
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict',
            maxAge: 0
        });

        return response;
    }
    catch (error: unknown)
    {
        const err = error as AxiosError;
        const message = err.response?.data || 'Greška prilikom odjave.';

        return NextResponse.json({ message }, { status: 400 });
    }
}

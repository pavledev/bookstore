import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import api from '@/utils/axios';
import { AxiosError } from "axios";

export const POST = async (req: Request) =>
{
    try
    {
        const body = await req.json();
        const response = await api.post('/auth/login', body);

        const { accessToken, refreshToken } = response.data;
        const cookieStore = await cookies();

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

        if (err.response?.data)
        {
            return new NextResponse(JSON.stringify(err.response?.data), {
                status: err.response?.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else if (err.response?.status === 403)
        {
            return new NextResponse(
                JSON.stringify({ global: 'Neuspešna prijava. Proverite podatke.' }),
                { status: err.response?.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new NextResponse(
            JSON.stringify({ global: 'Greška na serveru. Pokušajte ponovo.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

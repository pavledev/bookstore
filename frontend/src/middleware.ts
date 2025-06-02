import { NextRequest, NextResponse } from 'next/server';
import api from "@/utils/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JwtPayload } from "@/types/jwtPayload";

const AUTH_PAGES = ['/prijava', '/registracija'];
const JWT_SECRET = Uint8Array.from(atob(process.env.JWT_SECRET!), c => c.charCodeAt(0));

export const middleware = async (req: NextRequest) =>
{
    const currentAccessToken = req.cookies.get('accessToken')?.value;
    const currentRefreshToken = req.cookies.get('refreshToken')?.value;
    const isAuthPage = AUTH_PAGES.includes(req.nextUrl.pathname);

    if (currentAccessToken && isAuthPage)
    {
        const url = req.nextUrl.clone();

        url.pathname = '/';

        return NextResponse.redirect(url);
    }

    if (!currentAccessToken && currentRefreshToken)
    {
        const result = await refreshToken(currentRefreshToken);

        if (result.success)
        {
            const cookieStore = await cookies();
            const { accessToken, refreshToken } = result.data;

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

            return NextResponse.next();
        }

        const url = req.nextUrl.clone();

        url.pathname = '/prijava';

        return NextResponse.redirect(url);
    }

    if (!currentAccessToken && !isAuthPage)
    {
        const url = req.nextUrl.clone();

        url.pathname = '/prijava';

        return NextResponse.redirect(url);
    }

    if (currentAccessToken && req.nextUrl.pathname.startsWith('/admin'))
    {
        try
        {
            const { payload } = await jwtVerify(currentAccessToken, JWT_SECRET);
            const payload2 = payload as JwtPayload;

            if (!payload2.roles?.includes('ROLE_ADMIN'))
            {
                const url = req.nextUrl.clone();

                url.pathname = '/';

                return NextResponse.redirect(url);
            }
        }
        catch (err)
        {
            console.error('JWT verifikacija nije uspela:', err);

            const url = req.nextUrl.clone();

            url.pathname = '/prijava';

            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
};

const refreshToken = async (currentRefreshToken: string) =>
{
    try
    {
        const response = await api.post('/auth/refresh', { refreshToken: currentRefreshToken });
        return { success: true, data: response.data };
    }
    catch (error: unknown)
    {
        const err = error as AxiosError;

        return {
            success: false,
            error: err.response?.data || 'Neuspešno osvežavanje tokena.'
        };
    }
}

export const config = {
    matcher: ['/prijava', '/registracija', '/korpa', '/korisnik/:path*', '/admin/:path*']
};

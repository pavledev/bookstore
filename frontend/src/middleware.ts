import { NextRequest, NextResponse } from 'next/server';

const AUTH_PAGES = ['/prijava', '/registracija'];

export const middleware = (req: NextRequest) =>
{
    const accessToken = req.cookies.get('accessToken')?.value;
    const isAuthPage = AUTH_PAGES.includes(req.nextUrl.pathname);

    if (!accessToken && !isAuthPage)
    {
        const url = req.nextUrl.clone();

        url.pathname = '/prijava';

        return NextResponse.redirect(url);
    }

    if (accessToken && isAuthPage)
    {
        const url = req.nextUrl.clone();

        url.pathname = '/';

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/prijava', '/registracija', '/korpa', '/korisnik/:path*', '/admin/:path*']
};

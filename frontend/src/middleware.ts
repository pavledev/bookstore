import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/prijava', '/registracija'];

export const middleware = (req: NextRequest) =>
{
    const accessToken = req.cookies.get('accessToken')?.value;
    const isPublic = PUBLIC_PATHS.includes(req.nextUrl.pathname);

    if (!accessToken && !isPublic)
    {
        const url = req.nextUrl.clone();

        url.pathname = '/prijava';

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/korpa', '/korisnik/:path*', '/admin/:path*'],
};

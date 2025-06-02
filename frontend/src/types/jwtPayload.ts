export interface JwtPayload
{
    sub: string;
    roles?: string[];

    [key: string]: unknown;
}

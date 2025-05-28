'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType
{
    accessToken: string;
    setAccessToken: (token: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>
{
    const [accessToken, setAccessToken] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() =>
    {
        const refresh = async () =>
        {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok)
            {
                const data = await response.json();

                setIsLoggedIn(true);
                setAccessToken(data.accessToken);
            }
            else
            {
                setIsLoggedIn(false);
                setAccessToken('');
            }
        };

        refresh();
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
{
    const context = useContext(AuthContext);

    if (!context)
    {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

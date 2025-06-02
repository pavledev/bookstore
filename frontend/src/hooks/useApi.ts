import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const useApi = () =>
{
    const { accessToken, setIsLoggedIn, setAccessToken } = useAuth();

    const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use((config) =>
    {
        if (accessToken)
        {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    api.interceptors.response.use(
        response => response,
        async error =>
        {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry)
            {
                originalRequest._retry = true;

                try
                {
                    const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });

                    if (refreshResponse.ok)
                    {
                        const data = await refreshResponse.json();

                        setIsLoggedIn(true);
                        setAccessToken(data.accessToken);

                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                        return api(originalRequest);
                    }
                }
                catch (refreshError)
                {
                    console.error('Token refresh failed', refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
};

export default useApi;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'delfi.rs',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;

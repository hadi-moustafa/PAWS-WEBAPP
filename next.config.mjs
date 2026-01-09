/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placedog.net',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'placecats.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'zsazhcrsvvqtjqnwikpl.supabase.co',
                port: '',
            },
        ],
    },
};

export default nextConfig;

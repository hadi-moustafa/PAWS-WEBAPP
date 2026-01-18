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
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;

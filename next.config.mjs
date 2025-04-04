/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oyelpqtftxnngxvobptl.supabase.co'
      }
    ]
  }
};

export default nextConfig;

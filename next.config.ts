// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Securely allows images hosted on external CDNs or databases
      },
    ],
  },
};

export default nextConfig;

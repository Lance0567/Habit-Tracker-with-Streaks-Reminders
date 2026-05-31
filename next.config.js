/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  webpack(config, { dev }) {
    // Compress the dev filesystem cache to silence the
    // "Serializing big strings" PackFileCacheStrategy warning.
    if (dev && config.cache && typeof config.cache === 'object') {
      config.cache.compression = 'gzip';
    }
    return config;
  },
};
module.exports = nextConfig;

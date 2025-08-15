/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.gravatar.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

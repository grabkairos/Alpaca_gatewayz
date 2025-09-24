import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
  },
  allowedDevOrigins: ["*.cloudworkstations.dev"],
  webpack: (config, { isServer }) => {
    // Fix for Handlebars require.extensions issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    // Handle Handlebars module resolution
    if (!isServer) {
      // For client-side builds, we can ignore Handlebars entirely since it's used by Genkit
      config.resolve.alias = {
        ...config.resolve.alias,
        handlebars: false,
      };
    } else {
      // For server-side builds, provide a mock for require.extensions
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }

    // Ignore warnings about require.extensions
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
    ];

    return config;
  },
};

export default nextConfig;

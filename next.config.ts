import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers Configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://1detailatatime.com https://fonts.gstatic.com",
              "connect-src 'self' https://api.convex.dev https://*.convex.dev",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: [
              'accelerometer=()',
              'autoplay=()',
              'camera=()',
              'clipboard-write=()',
              'geolocation=(self)',
              'gyroscope=()',
              'magnetometer=()',
              'microphone=()',
              'payment=()',
              'usb=()'
            ].join(', ')
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      }
    ];
  },

  // Image Optimization Configuration
  images: {
    domains: ['1detailatatime.com', 'fonts.gstatic.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-separator'],
  },

  // Empty Turbopack configuration to resolve build conflicts
  turbopack: {},

  // Bundle analyzer for optimization
  webpack: (config, { dev, isServer }) => {

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\/]node_modules[\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://1detailatatime.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

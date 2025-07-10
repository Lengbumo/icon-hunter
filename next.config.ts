import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* SEO和性能优化配置 */
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'is1-ssl.mzstatic.com',
      'is2-ssl.mzstatic.com', 
      'is3-ssl.mzstatic.com',
      'is4-ssl.mzstatic.com',
      'is5-ssl.mzstatic.com',
      'api.iconify.design',
      'icons.iconify.design'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 重定向规则
  async redirects() {
    return [
      // 从旧的URL模式重定向到新的语言路由
      {
        source: '/zh',
        destination: '/zh-cn',
        permanent: true,
      },
      {
        source: '/chinese',
        destination: '/zh-cn', 
        permanent: true,
      },
      {
        source: '/english',
        destination: '/en',
        permanent: true,
      },
    ];
  },

  // 重写规则（用于API代理等）
  async rewrites() {
    return [
      // API路由重写（如果需要）
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/robots',
      },
    ];
  },
};

export default nextConfig;

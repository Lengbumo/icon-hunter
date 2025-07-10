import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en',
          '/zh-cn',
          '/api/search-apps',
          '/api/search-svg',
        ],
        disallow: [
          '/api/download-icon',
          '/api/batch-apps',
          '/downloaded-icons/',
          '/_next/',
          '/static/',
        ],
      },
      // 为主要搜索引擎提供特定规则
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: ['/', '/en', '/zh-cn'],
        crawlDelay: 1,
      },
      // 为百度等中文搜索引擎优化
      {
        userAgent: ['Baiduspider', 'Sogou web spider', '360Spider'],
        allow: ['/', '/zh-cn'],
        crawlDelay: 2,
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  }
} 
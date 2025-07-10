import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // 基础页面
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          zh: baseUrl,
          en: `${baseUrl}/en`,
        }
      }
    },
    {
      url: `${baseUrl}/zh-cn`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          zh: `${baseUrl}/zh-cn`,
          en: `${baseUrl}/en`,
        }
      }
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          zh: baseUrl,
          en: `${baseUrl}/en`,
        }
      }
    }
  ]

  return routes
}

// 生成额外的sitemap索引
export async function generateSitemaps() {
  return [
    { id: 'main' },
    { id: 'apps' },
    { id: 'icons' }
  ]
} 
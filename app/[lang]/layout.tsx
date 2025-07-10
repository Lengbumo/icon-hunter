import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

const seoContent = {
  'zh-cn': {
    title: "Icon Hunter - App Store图标搜索下载工具 | SVG图标库",
    description: "专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库。支持多国家地区搜索，多尺寸下载，一键复制功能。免费在线图标资源平台。",
    keywords: ["图标下载", "App Store图标", "SVG图标", "矢量图标", "应用图标", "图标搜索", "免费图标", "在线图标", "图标库", "设计资源"],
    locale: 'zh_CN',
    ogTitle: 'Icon Hunter - 专业图标搜索下载工具',
    ogDescription: '专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库。支持多国家地区搜索，多尺寸下载，一键复制功能。',
  },
  'en': {
    title: "Icon Hunter - App Store Icons & SVG Icon Library",
    description: "Professional App Store icon search and download tool with massive SVG vector icon library. Support multi-country search, multiple sizes download, one-click copy. Free online icon resource platform.",
    keywords: ["icon download", "app store icons", "svg icons", "vector icons", "app icons", "icon search", "free icons", "online icons", "icon library", "design resources"],
    locale: 'en_US',
    ogTitle: 'Icon Hunter - Professional Icon Search & Download Tool',
    ogDescription: 'Professional App Store icon search and download tool with massive SVG vector icon library. Multi-country search and multiple sizes download.',
  }
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const content = seoContent[lang as keyof typeof seoContent] || seoContent['zh-cn'];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    openGraph: {
      title: content.ogTitle,
      description: content.ogDescription,
      url: `${baseUrl}${lang === 'zh-cn' ? '/zh-cn' : lang === 'en' ? '/en' : ''}`,
      locale: content.locale,
      alternateLocale: lang === 'zh-cn' ? ['en_US'] : ['zh_CN'],
      type: 'website',
      siteName: 'Icon Hunter',
      images: [
        {
          url: `/og-image-${lang}.png`,
          width: 1200,
          height: 630,
          alt: content.ogTitle,
        },
      ],
    },
    twitter: {
      title: content.ogTitle,
      description: content.ogDescription,
      images: [`/og-image-${lang}.png`],
    },
    alternates: {
      canonical: `${baseUrl}${lang === 'zh-cn' ? '/zh-cn' : lang === 'en' ? '/en' : ''}`,
      languages: {
        'zh-CN': `${baseUrl}/zh-cn`,
        'en': `${baseUrl}/en`,
        'x-default': baseUrl,
      },
    },
    other: {
      'structured-data': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Icon Hunter",
        "description": content.description,
        "url": `${baseUrl}${lang === 'zh-cn' ? '/zh-cn' : lang === 'en' ? '/en' : ''}`,
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "Icon Hunter Team"
        },
        "inLanguage": [lang === 'en' ? 'en' : 'zh-CN']
      })
    }
  };
}

export default function LangLayout({ children }: LayoutProps) {
  return children;
} 
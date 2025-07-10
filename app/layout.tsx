import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./components.css";
import { LanguageProvider } from './contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Icon Hunter - App Store图标搜索下载工具 | SVG图标库",
    template: "%s | Icon Hunter"
  },
  description: "专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库。支持多国家地区搜索，多尺寸下载，一键复制功能。免费在线图标资源平台。",
  keywords: [
    "图标下载", "App Store图标", "SVG图标", "矢量图标", "应用图标", 
    "icon download", "app icons", "svg icons", "vector icons",
    "图标搜索", "免费图标", "在线图标", "图标库", "设计资源"
  ],
  authors: [{ name: "lengbumo" }],
  creator: "Icon Hunter",
  publisher: "Icon Hunter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh-cn',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: 'Icon Hunter - 专业图标搜索下载工具',
    description: '专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库。支持多国家地区搜索，多尺寸下载，一键复制功能。',
    siteName: 'Icon Hunter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Icon Hunter - 专业图标搜索下载工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icon Hunter - 专业图标搜索下载工具',
    description: '专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库。',
    images: ['/og-image.png'],
    creator: '@iconhunter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    yahoo: process.env.YAHOO_VERIFICATION_ID,
    other: {
      'baidu-site-verification': process.env.BAIDU_VERIFICATION_ID || '',
      'sogou_site_verification': process.env.SOGOU_VERIFICATION_ID || '',
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Icon Hunter",
              "description": "专业的App Store应用图标搜索下载工具，提供海量SVG矢量图标库",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
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
              "inLanguage": ["zh-CN", "en"]
            })
          }}
        />
        
        {/* 额外的SEO标签 */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"} />
        <link rel="alternate" hrefLang="zh-cn" href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/zh-cn`} />
        <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/en`} />
        <link rel="alternate" hrefLang="x-default" href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://itunes.apple.com" />
        <link rel="preconnect" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://itunes.apple.com" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
        
        {/* PWA相关 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Icon Hunter" />
        
        {/* 移动端优化 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 安全性 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

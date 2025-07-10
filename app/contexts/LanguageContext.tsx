'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Language = 'zh' | 'en';

// 定义翻译参数的类型
interface TranslationParams {
  [key: string]: string | number;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
  switchLanguageWithRoute: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations = {
  zh: {
    // 页面标题和主要内容
    appTitle: 'Icon Hunter',
    searchPlaceholderApp: '搜索应用名称...',
    searchPlaceholderSvg: '搜索SVG图标...',
    searchButton: '搜索',
    hotApps: '热门应用',
    tabAppstore: 'App Store',
    tabSvg: 'SVG图标',
    
    // 状态信息
    searching: '搜索中...',
    gettingHotApps: '获取热门应用中...',
    loading: '加载中...',
    loadingMore: '加载更多中...',
    
    // 结果显示
    foundApps: '找到 {count} 个应用',
    foundIcons: '找到 {count} 个图标',
    
    // 图标详情
    selectSize: '选择尺寸：',
    category: '分类：',
    author: '作者：',
    license: '许可：',
    downloadSuccess: '下载成功！',
    downloadFailed: '下载失败：',
    downloaded: '已复制',
    copyIcon: '复制图标',
    copySvg: '复制SVG',
    downloadLocal: '下载到本地',
    downloadSvg: '下载SVG',
    
    // 空状态
    emptyStateApp: '输入内容开始搜索',
    emptyStateSvg: '输入内容搜索 SVG 图标',
    
    // 错误信息
    networkError: '搜索失败，请检查网络连接',
    batchError: '批量获取失败，请检查网络连接',
    loadMoreError: '加载更多失败，请检查网络连接',
    
    // 国家选项
    allCountries: '全部国家',
    
    // 默认值
    general: '通用',
    unknown: '未知',
    svgIcon: 'SVG图标',
    
    // 语言切换
    switchLanguage: '切换语言',
  },
  en: {
    // 页面标题和主要内容
    appTitle: 'Icon Hunter',
    searchPlaceholderApp: 'Search app names...',
    searchPlaceholderSvg: 'Search SVG icons...',
    searchButton: 'Search',
    hotApps: 'Hot Apps',
    tabAppstore: 'App Store',
    tabSvg: 'SVG Icons',
    
    // 状态信息
    searching: 'Searching...',
    gettingHotApps: 'Getting hot apps...',
    loading: 'Loading...',
    loadingMore: 'Loading more...',
    
    // 结果显示
    foundApps: 'Found {count} apps',
    foundIcons: 'Found {count} icons',
    
    // 图标详情
    selectSize: 'Select Size:',
    category: 'Category:',
    author: 'Author:',
    license: 'License:',
    downloadSuccess: 'Download successful!',
    downloadFailed: 'Download failed:',
    downloaded: 'Copied',
    copyIcon: 'Copy Icon',
    copySvg: 'Copy SVG',
    downloadLocal: 'Download to Local',
    downloadSvg: 'Download SVG',
    
    // 空状态
    emptyStateApp: 'Enter content to start searching',
    emptyStateSvg: 'Enter content to search SVG icons',
    
    // 错误信息
    networkError: 'Search failed, please check network connection',
    batchError: 'Batch fetch failed, please check network connection',
    loadMoreError: 'Load more failed, please check network connection',
    
    // 国家选项
    allCountries: 'All Countries',
    
    // 默认值
    general: 'General',
    unknown: 'Unknown',
    svgIcon: 'SVG Icon',
    
    // 语言切换
    switchLanguage: 'Switch Language',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const router = useRouter();
  const pathname = usePathname();

  // 根据URL路径设置语言
  useEffect(() => {
    if (pathname === '/en') {
      setLanguage('en');
    } else if (pathname === '/zh-cn') {
      setLanguage('zh');
    } else if (pathname === '/') {
      setLanguage('zh'); // 根路径默认中文
    }
  }, [pathname]);

  // 保存语言偏好到localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('iconhunter-language', lang);
  };

  // 处理语言切换时的路由跳转
  const switchLanguageWithRoute = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    
    if (newLanguage === 'zh') {
      // 切换到中文，跳转到根路径
      router.push('/');
    } else {
      // 切换到英文，跳转到 /en
      router.push('/en');
    }
  };

  // 翻译函数
  const t = (key: string, params?: TranslationParams): string => {
    let text = translations[language][key as keyof typeof translations['zh']] || key;
    
    // 支持参数替换，如 {count}
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, switchLanguageWithRoute }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 
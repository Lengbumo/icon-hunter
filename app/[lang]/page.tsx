'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import HomePage from '../HomePage';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default function LangPage({ params }: PageProps) {
  const { lang } = use(params);
  const { setLanguage } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // 验证语言参数
    if (lang === 'en') {
      setLanguage('en');
    } else if (lang === 'zh-cn') {
      setLanguage('zh');
    } else {
      // 无效的语言参数，重定向到根路径
      router.replace('/');
    }
  }, [lang, setLanguage, router]);

  // 如果是无效的语言参数，返回null
  if (lang !== 'en' && lang !== 'zh-cn') {
    return null;
  }

  return <HomePage />;
} 
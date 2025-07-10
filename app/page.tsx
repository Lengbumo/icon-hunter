'use client';

import { useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import HomePage from './HomePage';

export default function Home() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // 根路径默认设置为中文
    setLanguage('zh');
  }, [setLanguage]);

  return <HomePage />;
}

'use client';

import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface SearchEvent {
  search_term: string;
  search_type: 'app' | 'svg';
  result_count?: number;
}

interface DownloadEvent {
  item_type: 'app_icon' | 'svg_icon';
  item_name: string;
  size?: string;
}

export function useAnalytics() {
  // Google Analytics 事件跟踪
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }, []);

  // 百度统计事件跟踪
  const trackBaiduEvent = useCallback((category: string, action: string, label?: string) => {
    if (typeof window !== 'undefined' && window._hmt) {
      window._hmt.push(['_trackEvent', category, action, label]);
    }
  }, []);

  // 搜索事件跟踪
  const trackSearch = useCallback((data: SearchEvent) => {
    // Google Analytics
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: `${data.search_type}_${data.search_term}`,
      value: data.result_count,
    });

    // 百度统计
    trackBaiduEvent(
      '搜索',
      data.search_type === 'app' ? '应用搜索' : 'SVG搜索',
      data.search_term
    );
  }, [trackEvent, trackBaiduEvent]);

  // 下载事件跟踪
  const trackDownload = useCallback((data: DownloadEvent) => {
    // Google Analytics
    trackEvent({
      action: 'download',
      category: 'engagement',
      label: `${data.item_type}_${data.item_name}`,
    });

    // 百度统计
    trackBaiduEvent(
      '下载',
      data.item_type === 'app_icon' ? '应用图标下载' : 'SVG图标下载',
      data.item_name
    );
  }, [trackEvent, trackBaiduEvent]);

  // 复制事件跟踪
  const trackCopy = useCallback((data: DownloadEvent) => {
    // Google Analytics
    trackEvent({
      action: 'copy',
      category: 'engagement',
      label: `${data.item_type}_${data.item_name}`,
    });

    // 百度统计
    trackBaiduEvent(
      '复制',
      data.item_type === 'app_icon' ? '应用图标复制' : 'SVG图标复制',
      data.item_name
    );
  }, [trackEvent, trackBaiduEvent]);

  // 页面浏览跟踪
  const trackPageView = useCallback((page_title: string, page_location: string) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title,
        page_location,
      });
    }

    // 百度统计
    if (typeof window !== 'undefined' && window._hmt) {
      window._hmt.push(['_trackPageview', page_location]);
    }
  }, []);

  return {
    trackEvent,
    trackBaiduEvent,
    trackSearch,
    trackDownload,
    trackCopy,
    trackPageView,
  };
} 
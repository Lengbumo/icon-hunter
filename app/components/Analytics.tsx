'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface AnalyticsProps {
  gaId?: string;
  baiduId?: string;
}

export default function Analytics({ gaId, baiduId }: AnalyticsProps) {
  useEffect(() => {
    // 百度统计初始化
    if (baiduId && typeof window !== 'undefined') {
      window._hmt = window._hmt || [];
    }
  }, [baiduId]);

  return (
    <>
      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* 百度统计 */}
      {baiduId && (
        <Script id="baidu-analytics" strategy="afterInteractive">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?${baiduId}";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      )}
    </>
  );
} 
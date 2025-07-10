// Google Analytics 全局类型声明
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  _hmt: any[];
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    _hmt: any[];
  }
}

// Google Analytics 事件类型
interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

// 百度统计事件类型
type BaiduEventType = ['_trackEvent', string, string, string?] | ['_trackPageview', string];

export { GtagEventParams, BaiduEventType }; 
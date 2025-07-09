// iTunes Search API 相关类型
export interface AppResult {
  trackId: number;
  trackName: string;
  artistName: string;
  bundleId: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl512: string;
  description: string;
  primaryGenreName: string;
  averageUserRating: number;
  userRatingCount: number;
  trackViewUrl: string;
  currency: string;
  price: number;
  fileSizeBytes: number;
  version: string;
  searchTerm?: string;
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: AppResult[];
}

// API 响应类型
export interface SearchAppsResponse {
  resultCount: number;
  results: AppResult[];
  searchTerm: string;
  limit: number;
  offset: number;
}

export interface BatchAppsResponse {
  resultCount: number;
  totalFound: number;
  results: AppResult[];
  searchTerms: string[];
  category: string;
  limit: number;
  startIndex: number;
  hasMore: boolean;
}

// 错误类型
export interface ApiError {
  error: string;
  status?: number;
}

// UI 相关类型
export type IconSize = '52' | '60' | '100' | '512';

// 下载进度类型
export interface DownloadStatus {
  downloading: boolean;
  success: boolean;
  error?: string;
}

export interface DownloadProgress {
  [trackId: number]: DownloadStatus;
}

// 已下载文件类型
export interface DownloadedFile {
  name: string;
  url: string;
  size?: number;
  downloadTime?: string;
}

// 选中的应用类型
export interface SelectedApp {
  app: AppResult;
  selectedSize: IconSize;
}

export interface SearchFilters {
  country?: string;
  limit?: number;
  offset?: number;
}

export interface BatchFilters {
  category?: string;
  limit?: number;
  startIndex?: number;
  country?: string;
}

// 常量类型
export const POPULAR_CATEGORIES = [
  'games', 'social networking', 'entertainment', 'utilities', 'productivity',
  'music', 'photo & video', 'travel', 'news', 'business', 'education',
  'lifestyle', 'shopping', 'sports', 'weather', 'health & fitness'
] as const;

export type CategoryType = typeof POPULAR_CATEGORIES[number];

export const ICON_SIZES = ['52', '60', '100', '512'] as const;
export type IconSizeType = typeof ICON_SIZES[number]; 
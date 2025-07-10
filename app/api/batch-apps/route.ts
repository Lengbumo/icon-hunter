import { NextRequest, NextResponse } from 'next/server';

// 定义应用数据类型
interface AppData {
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
  searchTerm: string;
}

// iTunes API 响应中的应用数据类型
interface iTunesAppData {
  trackId: number;
  trackName: string;
  artistName: string;
  bundleId: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl512: string;
  description: string;
  primaryGenreName: string;
  averageUserRating?: number;
  userRatingCount?: number;
  trackViewUrl: string;
  currency: string;
  price?: number;
  fileSizeBytes?: number;
  version?: string;
}

// 热门应用分类
const POPULAR_CATEGORIES = [
  'games', 'social networking', 'entertainment', 'utilities', 'productivity',
  'music', 'photo & video', 'travel', 'news', 'business', 'education',
  'lifestyle', 'shopping', 'sports', 'weather', 'health & fitness'
];

// 热门搜索关键词
const POPULAR_TERMS = [
  'instagram', 'tiktok', 'spotify', 'whatsapp', 'telegram', 'zoom',
  'netflix', 'youtube', 'facebook', 'twitter', 'linkedin', 'uber',
  'airbnb', 'amazon', 'microsoft', 'google', 'apple', 'adobe',
  'snapchat', 'discord', 'reddit', 'pinterest', 'dropbox', 'slack'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '200');
    const country = searchParams.get('country') || 'US';
    const startIndex = parseInt(searchParams.get('startIndex') || '0');

    let allApps: AppData[] = [];
    let searchTerms: string[] = [];

    if (category && POPULAR_CATEGORIES.includes(category.toLowerCase())) {
      // 按分类搜索
      searchTerms = [category];
    } else {
      // 使用热门关键词进行批量搜索
      searchTerms = POPULAR_TERMS.slice(startIndex, startIndex + 10);
    }

    console.log(`开始批量搜索应用，使用关键词: ${searchTerms.join(', ')}`);

    // 并行搜索多个关键词
    const searchPromises = searchTerms.map(async (term) => {
      try {
        const itunesUrl = new URL('https://itunes.apple.com/search');
        itunesUrl.searchParams.set('term', term);
        itunesUrl.searchParams.set('media', 'software');
        itunesUrl.searchParams.set('entity', 'software');
        itunesUrl.searchParams.set('limit', '50');
        itunesUrl.searchParams.set('country', country);

        const response = await fetch(itunesUrl.toString());
        
        if (!response.ok) {
          console.warn(`搜索关键词 "${term}" 失败: ${response.status}`);
          return { results: [] };
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.warn(`搜索关键词 "${term}" 时出错:`, error);
        return { results: [] };
      }
    });

    const searchResults = await Promise.all(searchPromises);

    // 合并和去重结果
    const appMap = new Map<number, AppData>();
    
    searchResults.forEach((result, index) => {
      if (result.results) {
        result.results.forEach((app: iTunesAppData) => {
          if (!appMap.has(app.trackId)) {
            appMap.set(app.trackId, {
              trackId: app.trackId,
              trackName: app.trackName,
              artistName: app.artistName,
              bundleId: app.bundleId,
              artworkUrl60: app.artworkUrl60,
              artworkUrl100: app.artworkUrl100,
              artworkUrl512: app.artworkUrl512,
              description: app.description,
              primaryGenreName: app.primaryGenreName,
              averageUserRating: app.averageUserRating || 0,
              userRatingCount: app.userRatingCount || 0,
              trackViewUrl: app.trackViewUrl,
              currency: app.currency,
              price: app.price || 0,
              fileSizeBytes: app.fileSizeBytes || 0,
              version: app.version || '未知',
              searchTerm: searchTerms[index],
            });
          }
        });
      }
    });

    allApps = Array.from(appMap.values());

    // 按评分和评价数量排序
    allApps.sort((a, b) => {
      const scoreA = (a.averageUserRating || 0) * Math.log(a.userRatingCount + 1);
      const scoreB = (b.averageUserRating || 0) * Math.log(b.userRatingCount + 1);
      return scoreB - scoreA;
    });

    // 限制返回数量
    const limitedResults = allApps.slice(0, limit);

    return NextResponse.json({
      resultCount: limitedResults.length,
      totalFound: allApps.length,
      results: limitedResults,
      searchTerms,
      category: category || 'mixed',
      limit,
      startIndex,
      hasMore: POPULAR_TERMS.length > startIndex + 10,
    });

  } catch (error) {
    console.error('批量搜索应用时出错:', error);
    return NextResponse.json(
      { error: '批量搜索应用失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取可用的分类列表
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'getCategories') {
      return NextResponse.json({
        categories: POPULAR_CATEGORIES,
        message: '获取分类列表成功'
      });
    }

    if (action === 'getPopularTerms') {
      return NextResponse.json({
        terms: POPULAR_TERMS,
        message: '获取热门关键词成功'
      });
    }

    return NextResponse.json(
      { error: '未知的操作类型' },
      { status: 400 }
    );

  } catch (error) {
    console.error('处理POST请求时出错:', error);
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 500 }
    );
  }
} 
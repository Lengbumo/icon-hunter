import { NextRequest, NextResponse } from 'next/server';

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
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: AppResult[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const limit = searchParams.get('limit') || '50';
    const country = searchParams.get('country') || 'US';
    const offset = searchParams.get('offset') || '0';

    if (!term) {
      return NextResponse.json(
        { error: '缺少搜索关键词参数' },
        { status: 400 }
      );
    }

    // 调用iTunes Search API
    const itunesUrl = new URL('https://itunes.apple.com/search');
    itunesUrl.searchParams.set('term', term);
    itunesUrl.searchParams.set('media', 'software');
    itunesUrl.searchParams.set('entity', 'software');
    itunesUrl.searchParams.set('limit', limit);
    itunesUrl.searchParams.set('country', country);
    itunesUrl.searchParams.set('offset', offset);

    const response = await fetch(itunesUrl.toString());
    
    if (!response.ok) {
      throw new Error(`iTunes API请求失败: ${response.status}`);
    }

    const data: iTunesSearchResponse = await response.json();

    // 过滤和格式化数据
    const formattedResults = data.results.map((app: any) => ({
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
    }));

    return NextResponse.json({
      resultCount: data.resultCount,
      results: formattedResults,
      searchTerm: term,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

  } catch (error) {
    console.error('搜索应用时出错:', error);
    return NextResponse.json(
      { error: '搜索应用失败，请稍后重试' },
      { status: 500 }
    );
  }
} 
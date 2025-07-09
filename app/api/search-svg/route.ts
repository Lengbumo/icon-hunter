import { NextRequest, NextResponse } from 'next/server';

export interface SvgIcon {
  id: string;
  name: string;
  url: string;
  svgContent?: string;
  source: string;
  category?: string;
  license?: string;
  author?: string;
  downloadUrl?: string;
}

export interface SvgSearchResponse {
  resultCount: number;
  results: SvgIcon[];
  searchTerm: string;
  offset: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

// Iconify API 相关接口
interface IconifySearchResult {
  icons: string[];
  total: number;
  limit: number;
  start: number;
  collections: Record<string, {
    name: string;
    total: number;
    author?: any;
    license?: any;
    samples?: any[];
    height?: number;
    category?: string;
    tags?: string[];
    palette?: boolean;
  }>;
  request?: {
    query: string;
    limit: string;
  };
}

interface IconifyIconInfo {
  body: string;
  width?: number;
  height?: number;
  viewBox?: string;
}

// 备用图标数据 - 当外部API不可用时使用
const fallbackIcons: SvgIcon[] = [
  {
    id: 'mdi:magnify',
    name: 'search',
    url: 'https://api.iconify.design/mdi:magnify.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:home',
    name: 'home',
    url: 'https://api.iconify.design/mdi:home.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:account',
    name: 'user',
    url: 'https://api.iconify.design/mdi:account.svg',
    source: 'Material Design Icons',
    category: 'User',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:heart',
    name: 'heart',
    url: 'https://api.iconify.design/mdi:heart.svg',
    source: 'Material Design Icons',
    category: 'Social',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:star',
    name: 'star',
    url: 'https://api.iconify.design/mdi:star.svg',
    source: 'Material Design Icons',
    category: 'Rating',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:download',
    name: 'download',
    url: 'https://api.iconify.design/mdi:download.svg',
    source: 'Material Design Icons',
    category: 'File',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:cog',
    name: 'settings',
    url: 'https://api.iconify.design/mdi:cog.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:email',
    name: 'email',
    url: 'https://api.iconify.design/mdi:email.svg',
    source: 'Material Design Icons',
    category: 'Communication',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:file',
    name: 'file',
    url: 'https://api.iconify.design/mdi:file.svg',
    source: 'Material Design Icons',
    category: 'File',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:folder',
    name: 'folder',
    url: 'https://api.iconify.design/mdi:folder.svg',
    source: 'Material Design Icons',
    category: 'File',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:image',
    name: 'image',
    url: 'https://api.iconify.design/mdi:image.svg',
    source: 'Material Design Icons',
    category: 'Media',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:plus',
    name: 'plus',
    url: 'https://api.iconify.design/mdi:plus.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:minus',
    name: 'minus',
    url: 'https://api.iconify.design/mdi:minus.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:check',
    name: 'check',
    url: 'https://api.iconify.design/mdi:check.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  },
  {
    id: 'mdi:close',
    name: 'close',
    url: 'https://api.iconify.design/mdi:close.svg',
    source: 'Material Design Icons',
    category: 'Action',
    license: 'Apache 2.0',
    author: 'Material Design'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!term) {
    return NextResponse.json(
      { error: '缺少搜索关键词参数' },
      { status: 400 }
    );
  }

  try {
    console.log(`开始搜索SVG图标: ${term}, offset: ${offset}, limit: ${limit}`);

    // 使用 Iconify API 搜索图标，请求更多数据以支持分页
    const apiLimit = Math.min((offset + limit) * 2, 200); // 请求更多数据
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(term)}&limit=${apiLimit}`;
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Icon Hunter App',
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Iconify API 搜索失败: ${searchResponse.status}`);
    }

    const searchData: IconifySearchResult = await searchResponse.json();
    console.log(`搜索结果总数: ${searchData.total}, 获取到: ${searchData.icons?.length || 0} 个图标`);

    // 处理搜索结果
    const allResults: SvgIcon[] = [];
    
    // 从搜索结果中提取图标
    if (searchData.icons && searchData.icons.length > 0) {
      for (const iconId of searchData.icons) {
        const [collectionId, iconName] = iconId.split(':');
        if (collectionId && iconName) {
          const iconUrl = `https://api.iconify.design/${iconId}.svg`;
          const collectionInfo = searchData.collections[collectionId];
          
          allResults.push({
            id: iconId,
            name: iconName.replace(/-/g, ' ').replace(/_/g, ' '),
            url: iconUrl,
            source: collectionInfo?.name || collectionId,
            category: collectionInfo?.category || 'General',
            license: collectionInfo?.license?.title || collectionInfo?.license || 'Unknown',
            author: collectionInfo?.author?.name || collectionInfo?.author || 'Unknown',
            downloadUrl: iconUrl
          });
        }
      }
    }

    console.log(`处理后总结果数: ${allResults.length}`);
    
    // 应用分页
    const startIndex = offset;
    const endIndex = offset + limit;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    const hasMore = endIndex < allResults.length || (searchData.total > allResults.length);

    console.log(`分页结果: ${paginatedResults.length}, hasMore: ${hasMore}`);

    // 如果分页结果为空但有搜索结果，使用备用图标数据
    if (paginatedResults.length === 0 && offset === 0) {
      console.log('使用备用图标数据');
      const fallbackResults = fallbackIcons.filter(icon => 
        icon.name.toLowerCase().includes(term.toLowerCase()) ||
        icon.category?.toLowerCase().includes(term.toLowerCase()) ||
        icon.author?.toLowerCase().includes(term.toLowerCase())
      ).slice(0, limit);

      return NextResponse.json({
        resultCount: fallbackResults.length,
        results: fallbackResults,
        searchTerm: term,
        offset: 0,
        limit,
        hasMore: false,
        total: fallbackResults.length,
      });
    }

    return NextResponse.json({
      resultCount: paginatedResults.length,
      results: paginatedResults,
      searchTerm: term,
      offset,
      limit,
      hasMore,
      total: searchData.total || allResults.length,
    });

  } catch (error) {
    console.error('搜索SVG图标时出错:', error);
    
    // API失败时使用备用图标数据
    console.log('API失败，使用备用图标数据');
    const fallbackResults = fallbackIcons.filter(icon => 
      icon.name.toLowerCase().includes(term.toLowerCase()) ||
      icon.category?.toLowerCase().includes(term.toLowerCase()) ||
      icon.author?.toLowerCase().includes(term.toLowerCase())
    ).slice(0, limit);

    if (fallbackResults.length > 0) {
      return NextResponse.json({
        resultCount: fallbackResults.length,
        results: fallbackResults,
        searchTerm: term,
      });
    }

    return NextResponse.json(
      { error: `搜索SVG图标失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
} 
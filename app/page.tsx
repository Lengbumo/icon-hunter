'use client';

import { useState, useEffect } from 'react';
import { AppResult, DownloadProgress, DownloadedFile, IconSize } from '@/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [apps, setApps] = useState<AppResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [batchLoading, setBatchLoading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
  const [showDownloaded, setShowDownloaded] = useState(false);

  const searchApps = async (term: string) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search-apps?term=${encodeURIComponent(term)}&limit=50`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setApps(data.results || []);
      }
    } catch (err) {
      setError('搜索失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const batchGetApps = async () => {
    setBatchLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/batch-apps?limit=100');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setApps(data.results || []);
      }
    } catch (err) {
      setError('批量获取失败，请检查网络连接');
    } finally {
      setBatchLoading(false);
    }
  };

  const downloadIcon = async (app: AppResult, size: IconSize) => {
    const iconUrl = size === '60' ? app.artworkUrl60 : 
                   size === '100' ? app.artworkUrl100 : 
                   app.artworkUrl512;
    
    setDownloadProgress(prev => ({
      ...prev,
      [app.trackId]: { downloading: true, success: false }
    }));

    try {
      const response = await fetch('/api/download-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iconUrl,
          appName: app.trackName,
          trackId: app.trackId,
          size,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setDownloadProgress(prev => ({
          ...prev,
          [app.trackId]: { downloading: false, success: true }
        }));
        // 刷新下载列表
        loadDownloadedFiles();
      } else {
        setDownloadProgress(prev => ({
          ...prev,
          [app.trackId]: { downloading: false, success: false, error: data.error }
        }));
      }
    } catch (err) {
      setDownloadProgress(prev => ({
        ...prev,
        [app.trackId]: { downloading: false, success: false, error: '下载失败' }
      }));
    }
  };

  const loadDownloadedFiles = async () => {
    try {
      const response = await fetch('/api/download-icon');
      const data = await response.json();
      setDownloadedFiles(data.files || []);
    } catch (err) {
      console.error('加载下载列表失败:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '未知';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    loadDownloadedFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto w-full px-0">
        {/* 头部 */}
        <div className="text-center mb-6 sm:mb-8 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎯 Icon Hunter
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            发现并下载 App Store 应用图标
          </p>
        </div>

        {/* 搜索和批量获取区域 */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 w-full max-w-full">
          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 w-full">
            <div className="w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchApps(searchTerm)}
                placeholder="搜索应用名称..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => searchApps(searchTerm)}
                disabled={loading || !searchTerm.trim()}
                className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              >
                {loading ? '搜索中...' : '搜索'}
              </button>
              <button
                onClick={batchGetApps}
                disabled={batchLoading}
                className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              >
                {batchLoading ? '获取中...' : '批量获取热门应用'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 w-full">
            <button
              onClick={() => setShowDownloaded(!showDownloaded)}
              className="w-full px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium transition-colors text-sm sm:text-base"
            >
              {showDownloaded ? '隐藏' : '显示'}已下载图标 ({downloadedFiles.length})
            </button>
            
            <div className="text-xs sm:text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border-l-4 border-blue-400 w-full">
              💡 <span className="hidden sm:inline">提示：鼠标悬浮在图标上可查看应用信息并下载不同尺寸的图标</span>
              <span className="sm:hidden">点击图标下载不同尺寸</span>
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 已下载图标列表 */}
        {showDownloaded && (
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 w-full max-w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">已下载的图标</h2>
            {downloadedFiles.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 md:gap-4 w-full">
                {downloadedFiles.map((file, index) => (
                  <div key={index} className="text-center w-full">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-lg sm:rounded-xl shadow-md max-w-full"
                    />
                    <p className="text-xs text-gray-600 mt-1 sm:mt-2 truncate w-full" title={file.name}>
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">暂无已下载的图标</p>
            )}
          </div>
        )}

        {/* 应用列表 */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 w-full max-w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
            应用列表 ({apps.length})
          </h2>
          
          {apps.length > 0 ? (
            <div className="border border-gray-200 rounded-lg bg-gray-50 p-2 sm:p-3 md:p-4 app-grid-container w-full max-w-full">
              <div className="max-h-80 sm:max-h-96 overflow-y-auto scrollbar-hidden w-full">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 md:gap-4 pb-6 sm:pb-8 w-full">
                  {apps.map((app) => (
                    <div key={app.trackId} className="group relative w-full">
                      {/* 应用图标 */}
                      <div className="relative w-full flex justify-center">
                        <img
                          src={app.artworkUrl100}
                          alt={app.trackName}
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer max-w-full"
                          title={`${app.trackName} - ${app.artistName}`}
                        />
                        
                        {/* 下载状态指示器 */}
                        {downloadProgress[app.trackId]?.downloading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        
                        {downloadProgress[app.trackId]?.success && (
                          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      {/* 悬浮时显示的下载按钮 */}
                      <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none group-hover:pointer-events-auto">
                        <div className="bg-white rounded-lg shadow-xl p-2 sm:p-3 border border-gray-200 min-w-max max-w-xs">
                          <div className="text-xs font-medium text-gray-800 mb-1 sm:mb-2 text-center truncate max-w-20 sm:max-w-24">
                            {app.trackName}
                          </div>
                          <div className="text-xs text-gray-500 mb-1 sm:mb-2 text-center truncate">
                            {app.artistName}
                          </div>
                          <div className="flex gap-1 justify-center">
                            {['60', '100', '512'].map((size) => {
                              const progress = downloadProgress[app.trackId];
                              return (
                                <button
                                  key={size}
                                  onClick={() => downloadIcon(app, size as IconSize)}
                                  disabled={progress?.downloading}
                                  className={`px-1.5 sm:px-2 py-1 text-xs rounded font-medium transition-colors ${
                                    progress?.success
                                      ? 'bg-green-100 text-green-700'
                                      : progress?.downloading
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
                                  title={`下载 ${size}px 图标`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                          {downloadProgress[app.trackId]?.error && (
                            <p className="text-red-500 text-xs mt-1 text-center">
                              下载失败
                            </p>
                          )}
                          {/* 小箭头 */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="w-0 h-0 border-l-3 border-r-3 border-t-3 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-transparent border-t-white"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 移动端点击显示下载选项 */}
                      <div className="sm:hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                          <div className="flex gap-1">
                            {['60', '100', '512'].map((size) => {
                              const progress = downloadProgress[app.trackId];
                              return (
                                <button
                                  key={size}
                                  onClick={() => downloadIcon(app, size as IconSize)}
                                  disabled={progress?.downloading}
                                  className={`px-1.5 py-1 text-xs rounded font-medium transition-colors ${
                                    progress?.success
                                      ? 'bg-green-200 text-green-800'
                                      : progress?.downloading
                                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                      : 'bg-white text-blue-700 hover:bg-blue-50'
                                  }`}
                                  title={`下载 ${size}px 图标`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 滚动提示 */}
              {/* <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  共找到 <span className="font-semibold text-blue-600">{apps.length}</span> 个应用
                </div>
              </div> */}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {loading || batchLoading ? '加载中...' : '输入关键词搜索应用，或点击批量获取热门应用'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

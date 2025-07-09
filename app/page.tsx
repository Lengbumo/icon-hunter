'use client';

import { useState, useEffect } from 'react';
import { AppResult, DownloadProgress, DownloadedFile, IconSize, SelectedApp } from '@/types';
import { FiDownload, FiCopy, FiCheck } from 'react-icons/fi';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [apps, setApps] = useState<AppResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [batchLoading, setBatchLoading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
  const [showDownloaded, setShowDownloaded] = useState(true);   
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleAppClick = (app: AppResult) => {
    setSelectedApp({
      app,
      selectedSize: '100' // 默认选择100px
    });
  };

  const handleSizeSelect = (size: IconSize) => {
    if (selectedApp) {
      setSelectedApp({
        ...selectedApp,
        selectedSize: size
      });
    }
  };

  const downloadToLocal = async (app: AppResult, size: IconSize) => {
    const iconUrl = size === '52' ? app.artworkUrl60 :
                   size === '60' ? app.artworkUrl60 : 
                   size === '100' ? app.artworkUrl100 : 
                   app.artworkUrl512;
    
    setDownloadProgress(prev => ({
      ...prev,
      [app.trackId]: { downloading: true, success: false }
    }));

    try {
      const response = await fetch(iconUrl);
      const blob = await response.blob();
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 从URL中提取文件扩展名
      const urlParts = iconUrl.split('.');
      const extension = urlParts[urlParts.length - 1];
      
      link.download = `${app.trackName}_${app.trackId}_${size}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      URL.revokeObjectURL(url);
      
      setDownloadProgress(prev => ({
        ...prev,
        [app.trackId]: { downloading: false, success: true }
      }));
      
    } catch (err) {
      setDownloadProgress(prev => ({
        ...prev,
        [app.trackId]: { downloading: false, success: false, error: '下载失败' }
      }));
    }
  };

  const copyToClipboard = async (app: AppResult, size: IconSize) => {
    const iconUrl = size === '52' ? app.artworkUrl60 :
                   size === '60' ? app.artworkUrl60 : 
                   size === '100' ? app.artworkUrl100 : 
                   app.artworkUrl512;
    
    try {
      // 获取图片数据
      const response = await fetch(iconUrl);
      const blob = await response.blob();
      
      // 创建Canvas将图片转换为PNG格式
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const imageUrl = URL.createObjectURL(blob);
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          URL.revokeObjectURL(imageUrl); // 清理内存
          resolve(null);
        };
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl); // 清理内存
          reject(new Error('图片加载失败'));
        };
        img.src = imageUrl;
      });
      
      // 转换为PNG格式的Blob
      const pngBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
      
      // 复制PNG图片到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': pngBlob
        })
      ]);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制图片失败:', err);
      
      // 如果复制图片失败，降级为复制链接
      try {
        await navigator.clipboard.writeText(iconUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('复制链接也失败:', fallbackErr);
      }
    }
  };

  const downloadIcon = async (app: AppResult, size: IconSize) => {
    const iconUrl = size === '52' ? app.artworkUrl60 :
                   size === '60' ? app.artworkUrl60 : 
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
    <div className="main-container">
      <div className="content-wrapper">
        {/* 简洁的头部 */}
        <div className="hero-section">
          <h1 className="hero-title">
            App Store Icon Finder
          </h1>
          
          {/* 主要搜索区域 */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchApps(searchTerm)}
                placeholder="搜索 App Store 应用..."
                className="hero-search-input"
              />
              <button
                onClick={() => searchApps(searchTerm)}
                disabled={loading || !searchTerm.trim()}
                className="hero-search-btn"
              >
                {loading ? '搜索中...' : '搜索'}
              </button>
              <button
                onClick={batchGetApps}
                disabled={batchLoading}
                className="hero-batch-btn"
              >
                {batchLoading ? '获取中...' : '热门应用'}
              </button>
            </div>
            
            {/* 加载状态 */}
            {(loading || batchLoading) && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>{loading ? '搜索中...' : '获取热门应用中...'}</p>
              </div>
            )}
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* 搜索结果区域 */}
        {apps.length > 0 && (
          <div className="results-section">
            {/* 应用详情展示 */}
            {selectedApp && (
              <div className="app-details-card">
                <div className="selected-app-details">
                  <div className="app-info">
                    <img
                      src={selectedApp.selectedSize === '52' ? selectedApp.app.artworkUrl60 :
                           selectedApp.selectedSize === '60' ? selectedApp.app.artworkUrl60 : 
                           selectedApp.selectedSize === '100' ? selectedApp.app.artworkUrl100 : 
                           selectedApp.app.artworkUrl512}
                      alt={selectedApp.app.trackName}
                      className="selected-app-icon"
                    />
                    <div className="app-details">
                      <h3 className="app-title">{selectedApp.app.trackName}</h3>
                      <p className="app-developer">{selectedApp.app.artistName}</p>
                      <p className="app-category">{selectedApp.app.primaryGenreName}</p>
                    </div>
                  </div>
                  
                  <div className="download-controls">
                    <div className="size-selector">
                      <label className="size-label">选择尺寸：</label>
                      <div className="size-buttons">
                        {['52', '60', '100', '512'].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size as IconSize)}
                            className={`btn-sm ${selectedApp.selectedSize === size ? 'btn-sm-selected' : 'btn-sm-blue'}`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="download-buttons">
                      <button
                        onClick={() => downloadToLocal(selectedApp.app, selectedApp.selectedSize)}
                        disabled={downloadProgress[selectedApp.app.trackId]?.downloading}
                        className="btn-icon btn-icon-primary"
                        title={downloadProgress[selectedApp.app.trackId]?.downloading ? '下载中...' : '下载到本地'}
                      >
                        <FiDownload size={18} />
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(selectedApp.app, selectedApp.selectedSize)}
                        className="btn-icon btn-icon-secondary"
                        title={copySuccess ? '已复制' : '复制图标'}
                      >
                        {copySuccess ? <FiCheck size={18} /> : <FiCopy size={18} />}
                      </button>
                    </div>
                    
                    {downloadProgress[selectedApp.app.trackId]?.success && (
                      <div className="download-success">
                        ✅ 下载成功！
                      </div>
                    )}
                    
                    {downloadProgress[selectedApp.app.trackId]?.error && (
                      <div className="download-error">
                        ❌ 下载失败：{downloadProgress[selectedApp.app.trackId]?.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 应用网格 */}
            <div className="apps-grid-section">
              <h2 className="results-title">
                找到 {apps.length} 个应用
              </h2>
              
              <div className="app-container">
                <div className="scroll-area scrollbar-hidden">
                  <div className="app-grid">
                    {apps.map((app) => (
                      <div 
                        key={app.trackId} 
                        className={`app-item ${selectedApp?.app.trackId === app.trackId ? 'app-item-selected' : ''}`}
                        onClick={() => handleAppClick(app)}
                      >
                        <div className="flex-center">
                          <img
                            src={app.artworkUrl100}
                            alt={app.trackName}
                            className="app-icon"
                            title={`${app.trackName} - ${app.artistName}`}
                          />
                          
                          {/* 选中状态指示器 */}
                          {selectedApp?.app.trackId === app.trackId && (
                            <div className="selected-indicator">
                              <span>✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

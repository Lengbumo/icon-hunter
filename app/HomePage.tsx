'use client';

import { useState, useEffect } from 'react';
import { AppResult, DownloadProgress, IconSize, SelectedApp, SvgIcon, SvgSearchResponse, TabType, SelectedSvgIcon } from '@/types';
import { FiDownload, FiCopy, FiCheck, FiSearch, FiGlobe } from 'react-icons/fi';
import { useLanguage } from './contexts/LanguageContext';
import { useAnalytics } from './hooks/useAnalytics';

export default function HomePage() {
  const { language, t, switchLanguageWithRoute } = useLanguage();
  const { trackSearch, trackDownload, trackCopy } = useAnalytics();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [activeTab, setActiveTab] = useState<TabType>('appstore');
  const [apps, setApps] = useState<AppResult[]>([]);
  const [svgIcons, setSvgIcons] = useState<SvgIcon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({});
  const [batchLoading, setBatchLoading] = useState(false);
   
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null);
  const [selectedSvgIcon, setSelectedSvgIcon] = useState<SelectedSvgIcon | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [svgOffset, setSvgOffset] = useState(0);
  const [svgHasMore, setSvgHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);



  // 国家选项列表
  const countryOptions = [
    { code: 'All', name: t('allCountries'), flag: '🌍' },
    { code: 'US', name: language === 'zh' ? '美国' : 'United States', flag: '🇺🇸' },
    { code: 'CN', name: language === 'zh' ? '中国' : 'China', flag: '🇨🇳' },
    { code: 'JP', name: language === 'zh' ? '日本' : 'Japan', flag: '🇯🇵' },
    { code: 'GB', name: language === 'zh' ? '英国' : 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: language === 'zh' ? '德国' : 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: language === 'zh' ? '法国' : 'France', flag: '🇫🇷' },
    { code: 'CA', name: language === 'zh' ? '加拿大' : 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: language === 'zh' ? '澳大利亚' : 'Australia', flag: '🇦🇺' },
  ];

  const searchApps = async (term: string) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const countryParam = selectedCountry === 'All' ? '' : `&country=${selectedCountry}`;
      const response = await fetch(`/api/search-apps?term=${encodeURIComponent(term)}&limit=60${countryParam}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        const results = data.results || [];
        setApps(results);
        
        // 发送搜索分析事件
        trackSearch({
          search_term: term,
          search_type: 'app',
          result_count: results.length
        });
      }
    } catch {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const batchGetApps = async () => {
    setBatchLoading(true);
    setError('');
    
    try {
      const countryParam = selectedCountry === 'All' ? '' : `&country=${selectedCountry}`;
      const response = await fetch(`/api/batch-apps?limit=100${countryParam}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setApps(data.results || []);
      }
    } catch {
      setError(t('batchError'));
    } finally {
      setBatchLoading(false);
    }
  };

  const searchSvgIcons = async (term: string, offset = 0) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search-svg?term=${encodeURIComponent(term)}&limit=60&offset=${offset}`);
      const data: SvgSearchResponse = await response.json();
      
      if (data.results) {
        if (offset === 0) {
          // 新搜索，替换结果
          setSvgIcons(data.results);
          setSvgOffset(data.limit);
          
          // 发送搜索分析事件（仅在新搜索时发送）
          trackSearch({
            search_term: term,
            search_type: 'svg',
            result_count: data.results.length
          });
        } else {
          // 加载更多，追加结果
          setSvgIcons(prev => [...prev, ...data.results]);
          setSvgOffset(prev => prev + data.limit);
        }
        setSvgHasMore(data.hasMore);
      } else {
        setError(t('networkError'));
      }
    } catch {
      setError(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSvgIcons = async () => {
    if (!searchTerm.trim() || loadingMore || !svgHasMore) return;
    
    setLoadingMore(true);
    
    try {
      await searchSvgIcons(searchTerm, svgOffset);
    } catch {
      setError(t('loadMoreError'));
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'appstore') {
      searchApps(searchTerm);
    } else {
      setSvgOffset(0);
      setSvgHasMore(false);
      searchSvgIcons(searchTerm);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setApps([]);
    setSvgIcons([]);
    setSelectedApp(null);
    setSelectedSvgIcon(null);
    setError('');
    setSvgOffset(0);
    setSvgHasMore(false);
  };

  const handleAppClick = (app: AppResult) => {
    setSelectedApp({
      app,
      selectedSize: '100' // 默认选择100px
    });
    setSelectedSvgIcon(null); // 清除SVG选择
  };

  const handleSvgIconClick = (icon: SvgIcon) => {
    setSelectedSvgIcon({ icon });
    setSelectedApp(null); // 清除App选择
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
    const iconUrl = size === '60' ? app.artworkUrl60 : 
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
      
      // 发送下载分析事件
      trackDownload({
        item_type: 'app_icon',
        item_name: app.trackName,
        size: `${size}px`
      });
      
    } catch {
      setDownloadProgress(prev => ({
        ...prev,
        [app.trackId]: { downloading: false, success: false, error: '下载失败' }
      }));
    }
  };

  const copyToClipboard = async (app: AppResult, size: IconSize) => {
    const iconUrl = size === '60' ? app.artworkUrl60 : 
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
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
                          try {
                await navigator.clipboard.write([
                  new ClipboardItem({
                    'image/png': pngBlob
                  })
                ]);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
                
                // 发送复制分析事件
                trackCopy({
                  item_type: 'app_icon',
                  item_name: app.trackName,
                  size: `${size}px`
                });
              } catch (_err) {
                console.error('复制失败:', _err);
              }
          }
        }, 'image/png');
        
        URL.revokeObjectURL(imageUrl);
      };
      
      img.src = imageUrl;
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const downloadSvgIcon = async (icon: SvgIcon) => {
    try {
      const response = await fetch(icon.url);
      const svgContent = await response.text();
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${icon.name.replace(/\s+/g, '_')}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // 发送下载分析事件
      trackDownload({
        item_type: 'svg_icon',
        item_name: icon.name
      });
    } catch (err) {
      console.error('下载SVG失败:', err);
    }
  };

  const copySvgIcon = async (icon: SvgIcon) => {
    try {
      const response = await fetch(icon.url);
      const svgContent = await response.text();
      
      await navigator.clipboard.writeText(svgContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      // 发送复制分析事件
      trackCopy({
        item_type: 'svg_icon',
        item_name: icon.name
      });
    } catch (_err) {
      console.error('复制SVG失败:', _err);
    }
  };



  const loadDownloadedFiles = async () => {
    try {
      const response = await fetch('/downloaded-icons');
      if (response.ok) {
        const html = await response.text();
        // 解析HTML获取文件列表
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".jpeg"]');
        // 这里可以进一步处理文件列表
      }
    } catch (_err) {
      console.error('加载下载文件失败:', _err);
    }
  };



  useEffect(() => {
    loadDownloadedFiles();
  }, []);

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* 简洁的头部 */}
        <div className="hero-section">
          {/* 语言切换按钮 */}
          <div className="language-switcher">
            <button
              onClick={switchLanguageWithRoute}
              className="language-btn"
              title={t('switchLanguage')}
            >
              <FiGlobe size={18} />
              <span>{language === 'zh' ? 'EN' : '中'}</span>
            </button>
          </div>
          
          <h1 className="hero-title">
            {t('appTitle')}
          </h1>

          {/* Tab 切换 */}
          <div className="tab-container">
            <div className="tab-list">
              <button
                onClick={() => handleTabChange('appstore')}
                className={`tab-button ${activeTab === 'appstore' ? 'tab-active' : ''}`}
              >
                {t('tabAppstore')}
              </button>
              <button
                onClick={() => handleTabChange('svg')}
                className={`tab-button ${activeTab === 'svg' ? 'tab-active' : ''}`}
              >
                {t('tabSvg')}
              </button>
            </div>
          </div>
          
          {/* 主要搜索区域 */}
          <div className="search-section">
            <div className="search-container">
              {/* 组合搜索输入框 */}
              <div className="search-input-group">
                {/* 国家选择下拉框 - 仅在App Store模式显示 */}
                {activeTab === 'appstore' && (
                  <div className="country-selector">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="country-select"
                    >
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code === 'All' ? country.name : country.flag + ' ' + country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={activeTab === 'appstore' ? t('searchPlaceholderApp') : t('searchPlaceholderSvg')}
                  className={`hero-search-input ${activeTab === 'svg' ? 'svg-search-input' : ''}`}
                />
              </div>
              
              <button
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                className="hero-search-btn"
              >
                {loading ? t('searching') : t('searchButton')}
              </button>
              {activeTab === 'appstore' && (
                <button
                  onClick={batchGetApps}
                  disabled={batchLoading}
                  className="hero-batch-btn"
                >
                  {batchLoading ? t('gettingHotApps') : t('hotApps')}
                </button>
              )}
            </div>
            
            {/* 加载状态 */}
            {(loading || batchLoading) && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>{loading ? t('searching') : t('gettingHotApps')}</p>
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
        {((activeTab === 'appstore' && apps.length > 0) || (activeTab === 'svg' && svgIcons.length > 0)) && (
          <div className="results-section">
            {/* 应用网格 */}
            <div className="apps-grid-section">
              <h2 className="results-title">
                {activeTab === 'appstore' ? t('foundApps', { count: apps.length }) : t('foundIcons', { count: svgIcons.length })}
              </h2>
              
              <div className="app-container">
                <div className="scroll-area scrollbar-hidden">
                  <div className="app-grid">
                    {activeTab === 'appstore' ? (
                      apps.map((app) => (
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
                      ))
                    ) : (
                      <>
                        {svgIcons.map((icon) => (
                          <div 
                            key={icon.id} 
                            className={`app-item ${selectedSvgIcon?.icon.id === icon.id ? 'app-item-selected' : ''}`}
                            onClick={() => handleSvgIconClick(icon)}
                          >
                            <div className="flex-center">
                              <img
                                src={icon.url}
                                alt={icon.name}
                                className="app-icon svg-icon"
                                title={`${icon.name} - ${icon.source}`}
                              />
                              
                              {/* 选中状态指示器 */}
                              {selectedSvgIcon?.icon.id === icon.id && (
                                <div className="selected-indicator">
                                  <span>✓</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Get More 按钮 */}
                        {svgHasMore && (
                          <div 
                            className="app-item get-more-item"
                            onClick={loadMoreSvgIcons}
                          >
                            <div className="flex-center">
                              <div className="get-more-icon">
                                {loadingMore ? (
                                  <div className="loading-spinner"></div>
                                ) : (
                                  <span className="get-more-text">···</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 应用详情展示 */}
            {activeTab === 'appstore' && selectedApp && (
              <div className="app-details-card">
                <div className="selected-app-details">
                  <div className="app-info">
                    <img
                      src={selectedApp.selectedSize === '60' ? selectedApp.app.artworkUrl60 : 
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
                      <label className="size-label">{t('selectSize')}</label>
                      <div className="size-buttons">
                        {['60', '100', '512'].map((size) => (
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
                        title={downloadProgress[selectedApp.app.trackId]?.downloading ? t('loading') : t('downloadLocal')}
                      >
                        <FiDownload size={18} />
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(selectedApp.app, selectedApp.selectedSize)}
                        className="btn-icon btn-icon-secondary"
                        title={copySuccess ? t('downloaded') : t('copyIcon')}
                      >
                        {copySuccess ? <FiCheck size={18} /> : <FiCopy size={18} />}
                      </button>
                    </div>
                    
                    {downloadProgress[selectedApp.app.trackId]?.success && (
                      <div className="download-success">
                        ✅ {t('downloadSuccess')}
                      </div>
                    )}
                    
                    {downloadProgress[selectedApp.app.trackId]?.error && (
                      <div className="download-error">
                        ❌ {t('downloadFailed')}{downloadProgress[selectedApp.app.trackId]?.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SVG图标详情展示 */}
            {activeTab === 'svg' && selectedSvgIcon && (
              <div className="app-details-card">
                <div className="selected-app-details">
                  <div className="app-info">
                    <div className="svg-icon-preview">
                      <img
                        src={selectedSvgIcon.icon.url}
                        alt={selectedSvgIcon.icon.name}
                        className="selected-app-icon"
                      />
                    </div>
                    <div className="app-details">
                      <h3 className="app-title">{selectedSvgIcon.icon.name}</h3>
                      <p className="app-developer">{selectedSvgIcon.icon.source}</p>
                      <p className="app-category">
                        {t('category')}{selectedSvgIcon.icon.category || t('general')}
                      </p>
                      <p className="app-category">
                        {t('author')}{selectedSvgIcon.icon.author || t('unknown')}
                      </p>
                      <p className="app-category">
                        {t('license')}{selectedSvgIcon.icon.license || t('unknown')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="download-controls">
                    <div className="download-buttons">
                      <button
                        onClick={() => downloadSvgIcon(selectedSvgIcon.icon)}
                        className="btn-icon btn-icon-primary"
                        title={t('downloadSvg')}
                      >
                        <FiDownload size={18} />
                      </button>
                      
                      <button
                        onClick={() => copySvgIcon(selectedSvgIcon.icon)}
                        className="btn-icon btn-icon-secondary"
                        title={copySuccess ? t('downloaded') : t('copySvg')}
                      >
                        {copySuccess ? <FiCheck size={18} /> : <FiCopy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 空状态提示 */}
        {!loading && !batchLoading && !error && 
         ((activeTab === 'appstore' && apps.length === 0) || (activeTab === 'svg' && svgIcons.length === 0)) && (
          <div className="empty-state-container">
            <div className="empty-state-content">
              <div className="search-icon-container">
                <FiSearch size={60} className="search-icon" />
              </div>
              <p className="empty-state-text">
                {activeTab === 'appstore' ? t('emptyStateApp') : t('emptyStateSvg')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
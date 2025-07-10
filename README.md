# 🎯 Icon Hunter

一个专业的 App Store 图标搜索下载工具，提供海量 SVG 矢量图标库。支持双语界面（中文/English），多国家地区搜索，多尺寸下载，一键复制功能。

## ✨ 功能特点

### 🎯 核心功能

- **App Store 图标搜索**: 搜索 iOS App Store 应用图标
- **SVG 图标搜索**: 查找多个图标库的矢量图标
- **多尺寸下载**: 支持 60px、100px、512px 等多种尺寸
- **一键复制**: 快速复制图标到剪贴板
- **国家地区筛选**: 按国家过滤 App Store 搜索结果
- **双语支持**: 完整的中英文界面切换

### 🌍 国际化特性

- **多语言界面**: 中文/英文双语支持
- **语言路由**: `/` (中文), `/en` (英文), `/zh-cn` (中文)
- **SEO 优化**: 针对中英文搜索引擎优化
- **本地化内容**: 语言特定的元数据和结构化数据

### 🚀 技术亮点

- **现代化架构**: Next.js 15 + TypeScript
- **性能优化**: 图片懒加载、缓存策略、代码分割
- **PWA 支持**: 渐进式 Web 应用特性
- **响应式设计**: 完美适配桌面和移动设备

## 🛠 技术栈

- **框架**: Next.js 15 with App Router
- **语言**: TypeScript
- **样式**: CSS Modules + 自定义 CSS
- **图标**: React Icons (Feather Icons)
- **国际化**: 自定义语言 Context 系统
- **APIs**:
  - iTunes Search API (App Store 数据)
  - Iconify API (SVG 图标)

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone <repository-url>
cd icon-hunter
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置 (可选)

```bash
# 创建环境变量文件
touch .env.local

# 添加基础配置
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.local
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 访问应用

打开 [http://localhost:3000](http://localhost:3000) 开始使用

## 📁 项目结构

```
icon-hunter/
├── app/
│   ├── [lang]/              # 动态语言路由
│   │   ├── layout.tsx       # 语言特定布局
│   │   └── page.tsx         # 语言页面
│   ├── api/                 # API路由
│   │   ├── search-apps/     # App Store搜索
│   │   ├── search-svg/      # SVG图标搜索
│   │   ├── batch-apps/      # 热门应用
│   │   └── download-icon/   # 图标下载
│   ├── contexts/            # React Contexts
│   │   └── LanguageContext.tsx  # 语言状态管理
│   ├── HomePage.tsx         # 主页面组件
│   ├── components.css       # 组件样式
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 默认首页
│   ├── sitemap.ts           # 站点地图
│   └── robots.ts            # 搜索引擎规则
├── types/
│   └── index.ts             # TypeScript类型定义
├── public/
│   ├── manifest.json        # PWA清单
│   └── ...                  # 静态资源
├── SEO-OPTIMIZATION-GUIDE.md  # SEO优化指南
└── README.md
```

## 📋 使用说明

### 1. 搜索应用图标

- 选择 **App Store** 标签页
- 在国家下拉菜单中选择目标地区
- 输入应用名称或关键词搜索
- 点击应用图标查看详情
- 选择尺寸后下载或复制

### 2. 搜索 SVG 图标

- 选择 **SVG 图标** 标签页
- 输入图标关键词搜索
- 点击图标查看详情信息
- 下载 SVG 文件或复制代码

### 3. 批量获取热门应用

- 在 App Store 标签页点击"热门应用"
- 系统自动获取各分类热门应用
- 按评分和受欢迎程度排序

### 4. 语言切换

- 点击右上角的语言切换按钮
- 支持中文(🌍 中)和英文(🌍EN)
- 切换时 URL 会自动更新

## 🌐 API 接口

| 路由                 | 方法 | 描述                |
| -------------------- | ---- | ------------------- |
| `/api/search-apps`   | GET  | 搜索 App Store 应用 |
| `/api/batch-apps`    | GET  | 获取热门应用列表    |
| `/api/search-svg`    | GET  | 搜索 SVG 图标       |
| `/api/download-icon` | POST | 下载图标到服务器    |

### API 参数示例

**搜索应用**:

```
GET /api/search-apps?term=instagram&country=US&limit=50
```

**搜索 SVG 图标**:

```
GET /api/search-svg?term=home&limit=60&offset=0
```

**批量获取应用**:

```
GET /api/batch-apps?limit=100&country=CN
```

## 🔧 SEO 优化

本项目包含完整的 SEO 优化配置，详见 [SEO 优化指南](./SEO-OPTIMIZATION-GUIDE.md)。

### 主要 SEO 特性

- ✅ 多语言元数据配置
- ✅ 结构化数据 (JSON-LD)
- ✅ Open Graph & Twitter Cards
- ✅ 自动生成 sitemap.xml
- ✅ 优化的 robots.txt
- ✅ 性能优化配置
- ✅ PWA 支持

### 环境变量配置

```env
# 基础配置
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# SEO验证 (可选)
GOOGLE_VERIFICATION_ID=your_google_verification_id
BAIDU_VERIFICATION_ID=your_baidu_verification_id
YANDEX_VERIFICATION_ID=your_yandex_verification_id
YAHOO_VERIFICATION_ID=your_yahoo_verification_id
SOGOU_VERIFICATION_ID=your_sogou_verification_id

# 分析工具 (可选)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=your_baidu_analytics_id
```

## 📱 PWA 支持

应用支持渐进式 Web 应用特性：

- 📱 可安装到主屏幕
- 🔄 离线缓存支持
- 🚀 快速启动
- 📊 应用快捷方式

## 🌟 部署指南

### Vercel 部署 (推荐)

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 配置环境变量
vercel env add NEXT_PUBLIC_BASE_URL
```

### 自定义服务器

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t icon-hunter .

# 运行容器
docker run -p 3000:3000 icon-hunter
```

## 🔍 功能演示

### 搜索功能

1. **Tab 切换**: App Store 图标 / SVG 图标
2. **国家选择**: 支持美国、中国、日本等多个国家
3. **实时搜索**: 输入关键词即时搜索
4. **热门应用**: 一键获取热门应用图标

### 下载功能

1. **多尺寸选择**: 60px / 100px / 512px
2. **本地下载**: 直接下载到设备
3. **剪贴板复制**: 一键复制图标
4. **SVG 复制**: 复制 SVG 代码

### 国际化功能

1. **语言切换**: 点击右上角语言按钮
2. **URL 同步**: 语言切换时 URL 自动更新
3. **内容本地化**: 所有界面文本的双语支持

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 添加必要的注释
- 更新相关文档

## 🐛 问题反馈

如果您遇到任何问题或有改进建议，请：

1. 查看 [常见问题](#常见问题)
2. 搜索现有的 [Issues](../../issues)
3. 创建新的 Issue 并提供详细信息

## 🙋‍♂️ 常见问题

**Q: 如何添加新的语言支持？**
A: 在 `LanguageContext.tsx` 中添加新的翻译字典，并更新路由配置。

**Q: 图标下载失败怎么办？**
A: 检查网络连接，某些图标可能有跨域限制。

**Q: 如何自定义样式主题？**
A: 修改 `globals.css` 和 `components.css` 中的 CSS 变量。

**Q: 支持哪些图标格式？**
A: 支持 PNG、JPG 格式的 App Store 图标和 SVG 格式的矢量图标。

**Q: 如何优化搜索结果？**
A: 使用更具体的关键词，选择合适的国家地区，或尝试不同的搜索词。

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 感谢苹果公司提供的 iTunes Search API
- 感谢 Iconify 提供的优质 SVG 图标库
- 感谢 Next.js 和 React 团队提供的优秀框架
- 感谢所有为此项目做出贡献的开发者

---

如果这个项目对您有帮助，请给个 ⭐️ 支持一下！

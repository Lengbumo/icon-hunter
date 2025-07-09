# 🎯 Icon Hunter

一个基于 Next.js 的应用图标获取工具，可以搜索并下载 App Store 应用的高清图标。

## ✨ 功能特性

### 核心功能

- **应用搜索**：通过关键词搜索 App Store 应用
- **批量枚举**：一键获取热门应用列表
- **应用详情**：点击应用图标查看详细信息（名称、开发者、分类、评分）
- **多种操作**：支持下载 60px、100px、512px 三种尺寸的图标
  - **本地下载**：精致的 📥 图标按钮，一键下载到设备
  - **图标复制**：精致的 📋 图标按钮，复制图标图片到剪贴板
- **实时状态**：下载进度和状态实时反馈
- **直观交互**：点击选择，纯图标按钮，悬浮提示说明

### 技术特性

- 🚀 基于 Next.js 14 App Router
- 🎨 使用统一的 CSS 架构构建响应式界面
- 📱 完全响应式设计，支持移动端
- 🔄 实时下载进度显示
- 📂 自动文件管理和去重
- 🌐 调用苹果官方 iTunes Search API
- 🎯 使用 React Icons 提供直观的图标化交互
- 📋 支持现代浏览器的剪贴板 API，自动将图标转换为 PNG 格式复制到剪贴板

## 🏗️ 项目结构

```
icon-hunter/
├── app/                          # Next.js App Router
│   ├── api/                     # API 路由
│   │   ├── search-apps/         # 搜索应用接口
│   │   ├── download-icon/       # 下载图标接口
│   │   └── batch-apps/          # 批量获取应用接口
│   ├── page.tsx                 # 主页面组件
│   ├── layout.tsx               # 布局组件
│   ├── globals.css              # 全局样式
│   └── components.css           # 组件样式（统一 CSS）
├── public/
│   └── downloaded-icons/        # 下载的图标存储目录
├── types/
│   └── index.ts                 # TypeScript 类型定义
├── package.json                 # 项目依赖
└── README.md                    # 项目说明
```

## 🎨 样式架构

### CSS 组织结构

项目采用**统一的 CSS 架构**，将所有样式从内联的 Tailwind 类名重构为语义化的自定义 CSS 类：

#### 1. 样式文件结构

- **`globals.css`**：全局样式、基础重置、滚动条等
- **`components.css`**：组件样式，按功能模块化组织

#### 2. 样式分类

**容器样式**

- `.main-container`：主容器，包含背景渐变和基础布局
- `.content-wrapper`：内容包装器，控制最大宽度和居中
- `.card`：卡片容器，统一的白色背景和阴影

**组件样式**

- `.header`、`.header-title`、`.header-subtitle`：头部相关
- `.search-input`：搜索输入框
- `.btn`、`.btn-primary`、`.btn-secondary`、`.btn-success`、`.btn-purple`：按钮样式
- `.icon-button`：图标按钮样式，支持图标和文本组合
- `.btn-sm`、`.btn-sm-blue`、`.btn-sm-green`、`.btn-sm-selected`：小按钮样式

**布局样式**

- `.app-grid`：应用图标网格布局
- `.app-container`：应用列表容器
- `.scroll-area`：滚动区域

**交互样式**

- `.app-item`、`.app-item-selected`：应用项容器和选中状态
- `.selected-indicator`：选中状态指示器
- `.selected-app-details`：选中应用详情展示
- `.app-info`、`.app-details`：应用信息布局
- `.download-controls`：下载控制区域

**应用详情样式**

- `.selected-app-icon`：选中应用的大图标
- `.app-title`、`.app-developer`、`.app-category`、`.app-rating`：应用信息文本
- `.size-selector`、`.size-buttons`：尺寸选择器
- `.download-buttons`：下载按钮组
- `.download-success`、`.download-error`：下载状态提示

#### 3. 响应式设计

所有样式都采用 **Mobile-First** 设计原则：

```css
/* 基础样式（移动端） */
.app-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

/* 平板样式 */
@media (min-width: 640px) {
  .app-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
  }
}

/* 桌面样式 */
@media (min-width: 768px) {
  .app-grid {
    grid-template-columns: repeat(8, 1fr);
    gap: 1rem;
  }
}
```

#### 4. 样式命名规范

- **语义化命名**：使用描述性的类名，如 `.search-input`、`.app-icon`
- **模块化组织**：按功能模块划分，如按钮组、网格布局、状态指示器
- **状态修饰符**：如 `.btn-primary`、`.btn-success`、`.btn-sm-blue`

#### 5. 样式优势

**可维护性**

- 集中管理：所有样式在一个文件中，易于维护
- 语义化：类名清晰表达用途和功能
- 模块化：按功能分组，便于定位和修改

**性能优化**

- 减少类名长度：从长 Tailwind 类名压缩为简短自定义类名
- 样式复用：相同样式只定义一次，提高复用性
- 减少 HTML 体积：显著减少 HTML 中的类名字符数

**扩展性**

- 易于主题化：统一的 CSS 变量和颜色定义
- 响应式一致性：所有组件遵循统一的响应式规则
- 自定义灵活：可以轻松添加新的样式变体

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 主要依赖

- **next**: ^14.0.0 - React 全栈框架
- **react**: ^18.0.0 - React 核心库
- **typescript**: ^5.0.0 - TypeScript 支持
- **react-icons**: ^4.0.0 - 图标库

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可使用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📋 使用说明

### 1. 搜索应用

- 在搜索框中输入应用名称或关键词
- 点击"搜索"按钮或按回车键
- 系统将显示匹配的应用列表

### 2. 批量获取热门应用

- 点击"批量获取热门应用"按钮
- 系统自动获取多个热门分类的应用
- 结果按评分和受欢迎程度排序

### 3. 选择和查看应用详情

- 在应用网格中，点击任意应用图标
- 选中的应用会显示蓝色边框和 ✓ 标记
- 应用详情将在上方区域显示，包括：
  - 应用大图标
  - 应用名称和开发者
  - 应用分类和评分信息

### 4. 下载和操作图标

- 在应用详情区域，选择所需的图标尺寸（60、100、512 像素）
- 点击 📥 图标按钮下载到本地设备（鼠标悬浮显示"下载到本地"）
- 点击 📋 图标按钮复制图标图片到剪贴板（鼠标悬浮显示"复制图标"）
- 复制成功后按钮会短暂显示 ✅ 勾号图标
- 下载状态会实时显示（下载中、成功、失败）
- 图标文件命名格式：`应用名_应用ID_尺寸.扩展名`

## 🔧 API 接口说明

### 1. 搜索应用 API

```
GET /api/search-apps?term={keyword}&limit={number}&country={code}
```

- `term`: 搜索关键词（必需）
- `limit`: 返回结果数量限制，默认 50
- `country`: 国家代码，默认 US

### 2. 下载图标 API

```
POST /api/download-icon
Body: {
  iconUrl: string,
  appName: string,
  trackId: number,
  size: string
}
```

### 3. 批量获取应用 API

```
GET /api/batch-apps?category={category}&limit={number}&startIndex={number}
```

- `category`: 应用分类（可选）
- `limit`: 返回结果数量，默认 200
- `startIndex`: 起始索引，用于分页

### 4. 获取下载列表 API

```
GET /api/download-icon
```

返回已下载的图标文件列表。

## 📜 许可证

MIT License - 详见 LICENSE 文件

## 🙏 致谢

- 感谢苹果公司提供的 iTunes Search API
- 感谢 Next.js 和 Tailwind CSS 团队提供的优秀框架

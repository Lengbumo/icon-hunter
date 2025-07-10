# 🎯 Icon Hunter

一个专业的 App Store 图标搜索下载工具，提供海量 SVG 矢量图标库。支持双语界面（中文/English），多国家地区搜索，多尺寸下载，一键复制功能。

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Lengbumo/icon-hunter.git
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

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 感谢苹果公司提供的 iTunes Search API
- 感谢 Iconify 提供的优质 SVG 图标库
- 感谢 Next.js 和 React 团队提供的优秀框架
---

如果这个项目对您有帮助，请给个 ⭐️ 支持一下！

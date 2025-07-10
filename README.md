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

## 🐳 Docker 部署

### 手动构建

```bash
# Alpine版本 (推荐)
docker build -f Dockerfile.alpine -t icon-hunter .

# Distroless版本 (最小体积)
docker build -f Dockerfile -t icon-hunter .
```

### 运行容器

```bash
# 运行应用
docker run -p 3000:3000 icon-hunter

# 后台运行
docker run -d -p 3000:3000 --name icon-hunter-app icon-hunter

# 带环境变量运行
docker run -p 3000:3000 -e NODE_ENV=production icon-hunter
```

### Docker Compose 部署

#### 1. 配置环境变量

首先创建 `.env` 文件：

```bash
# 复制模板文件
cp .env.example .env

# 编辑配置
nano .env
```

设置您的域名：

```env
# 必需配置
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

#### 2. 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 3. 完整的 docker-compose.yml 配置

当前配置已支持从 `.env` 文件读取环境变量：

```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    ports:
      - "8989:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env
    restart: unless-stopped
```

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- 感谢苹果公司提供的 iTunes Search API
- 感谢 Iconify 提供的优质 SVG 图标库
- 感谢 Next.js 和 React 团队提供的优秀框架

---

如果这个项目对您有帮助，请给个 ⭐️ 支持一下！

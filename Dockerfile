# Icon Hunter Dockerfile
# 多阶段构建优化镜像大小

# ==========================================
# 基础镜像
# ==========================================
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache libc6-compat

# 复制package文件
COPY package*.json ./

# ==========================================
# 依赖安装阶段
# ==========================================
FROM base AS deps

# 设置npm镜像源（可选，提高国内下载速度）
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 安装开发依赖（构建需要）
RUN npm ci

# ==========================================
# 构建阶段
# ==========================================
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 设置构建环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN npm run build

# ==========================================
# 运行阶段
# ==========================================
FROM base AS runner

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动应用
CMD ["node", "server.js"]
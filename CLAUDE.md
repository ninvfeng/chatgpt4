# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Anse - AI 聊天应用

这是一个基于 Astro + Solid.js 构建的 AI 聊天应用，主要用于与 OpenAI API 交互。

## 开发命令

### 基础命令
```bash
# 安装依赖
pnpm install

# 本地开发 (运行在 http://localhost:3000)
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

### 部署相关
```bash
# 构建 Vercel 版本
pnpm build:vercel

# 构建 Netlify 版本
pnpm build:netlify

# Docker 构建
docker build -t anse .
docker run -p 3000:3000 anse
```

## 技术架构

### 核心技术栈
- **框架**: Astro 2.2 (SSR 框架)
- **UI 框架**: Solid.js 1.6
- **样式**: UnoCSS + 自定义 CSS
- **状态管理**: Nanostores
- **数据存储**: IndexedDB (通过 idb-keyval)
- **构建工具**: Vite
- **包管理**: pnpm 7.28

### 项目结构

#### Provider 系统
- `src/providers/` - AI 提供商插件系统
  - `openai/` - OpenAI 实现（主要提供商）
    - `handler.ts` - 处理聊天请求的核心逻辑
    - `api.ts` - API 调用封装
    - `parser.ts` - 响应解析
  - `replicate/` - Replicate 提供商
  - `stable-diffusion/` - 图像生成

#### 核心组件
- `src/components/main/` - 主要聊天界面组件
  - `Conversation.tsx` - 对话容器
  - `Continuous.tsx` - 连续对话模式
  - `Single.tsx` - 单次对话模式
  - `MessageItem.tsx` - 消息展示
  - `Welcome.tsx` - 欢迎页面
  - `Charge.tsx` - 充值相关

#### 状态管理
- `src/stores/` - 全局状态
  - `conversation.ts` - 对话管理
  - `messages.ts` - 消息管理
  - `provider.ts` - 提供商配置
  - `settings.ts` - 应用设置
  - `storage/` - IndexedDB 持久化层

#### API 路由
- `src/pages/api/` - 服务端 API
  - `handle/[provider].ts` - 动态路由处理不同 AI 提供商
  - `auth.ts` - 认证相关
  - `login.ts` - 登录接口
  - 支付相关接口（getpaycode, paynotice 等）

## 关键特性实现

### 流式响应处理
- 使用 EventSource 和 EventSource Parser 处理 SSE 流
- `src/logics/stream.ts` 包含流处理逻辑

### 多语言支持
- `src/locale/` 目录包含国际化配置
- 支持中文（zh-cn）和英文（en）

### PWA 支持
- 使用 vite-plugin-pwa 实现 PWA
- 注意：PWA 不支持 Netlify 部署

### UI 组件系统
- 基于 Zag.js 构建的无障碍组件
- 自定义 UI 组件在 `src/components/ui/`

## 开发注意事项

1. **环境要求**：Node.js v18+
2. **TypeScript 配置**：使用严格模式，路径别名 `@/` 映射到 `src/`
3. **代码风格**：使用 ESLint 配置，运行 `pnpm lint:fix` 自动修复
4. **Git Hooks**：使用 simple-git-hooks + lint-staged 进行提交前检查
5. **部署适配**：根据 OUTPUT 环境变量自动选择适配器（Vercel/Netlify/Node）

## 当前正在修改的文件
- `src/components/main/Charge.tsx` - 充值组件
- `src/components/main/Welcome.tsx` - 欢迎页面
- `src/providers/openai/handler.ts` - OpenAI 处理器
- `src/providers/openai/index.ts` - OpenAI 配置

## 重要配置
- OpenAI 模型配置在 `src/providers/openai/index.ts` 中
- 当前支持 gpt-5 模型
- 认证信息存储在 localStorage 中
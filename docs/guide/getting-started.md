# 快速开始

## 环境要求

- Node.js >= 20
- pnpm >= 10（推荐通过 `corepack enable` 启用，版本由 `packageManager` 字段锁定）

## 安装与运行

```sh
pnpm install      # 安装依赖
pnpm run dev      # 启动业务开发服务器（默认 http://localhost:5173）
pnpm run build    # 类型检查 + 构建产物
pnpm run preview  # 预览构建产物
```

## 文档站

```sh
pnpm run docs:dev      # 文档站开发（http://localhost:1543）
pnpm run docs:build    # 构建文档站（产物 docs/.vitepress/dist/）
pnpm run docs:preview  # 预览文档站构建产物
pnpm run docs:sync     # 重新同步组件 api.md 到文档站
```

## 目录结构

```
src/
├── components/
│   ├── ui/          # shadcn-vue 组件（CLI 管理，可自由修改）
│   └── x/           # X 系列业务组件（四件套规范）
├── lib/utils.ts     # cn() 工具
├── plugins/         # 应用级插件（Pinia 注册、toast）
├── store/theme.ts   # 主题配置 store
├── style.css        # Tailwind 入口 + shadcn 主题变量
└── App.vue
docs/                # VitePress 文档站
├── .vitepress/      # 配置与主题
├── demo-app/        # 组件演示 SPA（构建进 public/demos）
├── guide/           # 手写指南
└── reference/       # 组件 API 页（生成物，不提交）
script/              # 文档同步等脚本
```

## 添加 shadcn 组件

```sh
pnpm dlx shadcn-vue@latest add dialog
```

组件会安装到 `src/components/ui/dialog/`，随后可在业务代码中按需引入。

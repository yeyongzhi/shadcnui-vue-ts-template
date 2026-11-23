# 文档站维护

## 来源分层

| 内容 | 位置 | 维护方式 |
|------|------|----------|
| 首页 / 导航 | `docs/index.md`、`docs/.vitepress/config.mts` | 手写 |
| 指南 | `docs/guide/` | 手写 |
| 组件 API | `src/components/x/**/api.md` | 手写（唯一来源） |
| 组件演示 | `docs/demo-app/` | 手写 |
| API 页面 / 侧边栏 / 索引 | `docs/reference/`、`docs/.vitepress/generated/catalog.json` | **生成物，不提交 Git** |

## 日常修改

1. 修改组件旁的 `api.md`（或新增组件）
2. 运行 `pnpm run docs:sync`
3. `pnpm run docs:dev` 本地预览（端口 1543）

dev 服务运行期间新增 / 移除 API 页面需重启 dev 以更新侧边栏。

## 构建与部署

```sh
pnpm run docs:build    # = docs:sync + vitepress build，产物 docs/.vitepress/dist/
pnpm run docs:preview  # 本地预览构建产物（必须走 HTTP，不直接双击 HTML）
```

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy-docs.yml`）自动构建并发布到 GitHub Pages，访问地址：

```
https://yeyongzhi.github.io/shadcnui-vue-ts-template/
```

首次使用需在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

## 子路径部署

非 GitHub Pages 场景部署到子路径时，构建前设置环境变量：

```sh
DOCS_BASE=/my-sub-path/ pnpm run docs:build
```

值必须以 `/` 开头和结尾（配置里强制校验）。

## 组件演示

演示是独立 Vite SPA（`docs/demo-app/`），构建产物输出到 `docs/public/demos/`，随 VitePress 一起发布。`docs:build` 已包含演示构建（`pnpm run docs:demos`）；本地开发文档站前需先执行一次 `pnpm run docs:demos`，否则 iframe 显示「演示加载中」。

## 清理

`docs/.vitepress/cache`、`docs/.vitepress/dist`、`docs/public/demos` 均为构建产物，可随时删除重新生成。

# 介绍

**shadcnui-vue-ts-template** 是一个基于以下技术栈的 Vue 项目模板：

- Vue 3.5（Composition API + `<script setup>` + TypeScript）
- Vite 8 + Tailwind CSS 4
- shadcn-vue（基于 reka-ui，组件源码直接放入项目）
- Pinia + VueUse
- VitePress 文档站（本项目）

## 特性

### X 系列组件

参考 FrontCore 项目的 PC 端组件，基于 shadcn-vue 重新实现的业务组件系列，位于 `src/components/x/`。每个组件遵循统一的「四件套」规范（`index.ts` + `index.vue` + `constant.ts` + `api.md`），文档站的组件 API 页面由 `api.md` 自动生成。

### 主题配置

- 明暗模式（亮色 / 暗色 / 跟随系统），基于 VueUse `useColorMode`
- 主题色预设（经典七色、莫兰迪色系），运行时注入 CSS 变量
- 配置整包持久化到 localStorage，刷新自动恢复

### 文档站

组件演示 + API 文档一体化的 VitePress 站点，支持 GitHub Pages 自动部署。

## 下一步

- [快速开始](./getting-started) 了解项目结构与常用命令
- [主题配置](./theme) 了解主题系统实现
- [组件开发规范](./component-conventions) 了解如何新增组件

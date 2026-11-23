import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// 组件演示 SPA 独立构建配置：复用 src/ 源码组件 + Tailwind 样式，
// 产物输出到 docs/public/demos，随 VitePress 一起发布。
// 与主 vite.config.ts、VitePress 配置互不影响。
export default defineConfig({
  root: path.resolve(__dirname, 'demo-app'),
  base: './',
  publicDir: false,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      // demo-app 入口引用 src/style.css（Tailwind + shadcn 变量），确保演示与业务样式一致
      '@/style.css': path.resolve(__dirname, '../src/style.css'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'public/demos'),
    emptyOutDir: true,
  },
})

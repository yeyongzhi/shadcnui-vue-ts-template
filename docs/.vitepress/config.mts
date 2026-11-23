import fs from 'node:fs'
import { defineConfig } from 'vitepress'

// 部署子路径：GitHub Pages 等场景通过环境变量注入（如 /shadcnui-vue-ts-template/）
const base = process.env.DOCS_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error(`DOCS_BASE 必须以 / 开头和结尾，当前值：${base}`)
}

// 组件侧边栏由 sync 脚本生成的 catalog.json 驱动
const catalog = JSON.parse(
  fs.readFileSync(new URL('./generated/catalog.json', import.meta.url), 'utf8'),
)

export default defineConfig({
  lang: 'zh-CN',
  title: 'shadcnui-vue-ts-template',
  description: '基于 Vue 3 + TypeScript + Tailwind CSS 4 + shadcn-vue 的项目模板',
  base,
  cleanUrls: false,
  // README.md 与 demo-app（独立 SPA，只以 public/demos 构建产物形式使用）不参与 VitePress 构建
  srcExclude: ['README.md', 'demo-app/**'],

  vite: {
    resolve: {
      // demo-app 内的源文件引用了 @/ 别名；VitePress 的依赖扫描会读到它们，
      // 提供同样的别名即可解析（与 docs/vite.demo.config.ts 保持一致）
      alias: {
        '@/style.css': new URL('../src/style.css', import.meta.url).pathname,
        '@': new URL('../src', import.meta.url).pathname,
      },
    },
  },
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '组件', link: '/reference/index', activeMatch: '/reference/' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '主题配置', link: '/guide/theme' },
          { text: '组件开发规范', link: '/guide/component-conventions' },
          { text: '文档站维护', link: '/guide/documentation' },
        ],
      },
      ...catalog.map(group => ({
        text: group.title,
        collapsed: true,
        items: [
          { text: '总览', link: '/reference/index' },
          ...group.items.map(item => ({ text: item.text, link: item.link })),
        ],
      })),    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询条件',
            displayDetails: '显示详细列表',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    outline: [2, 3],
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: false,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yeyongzhi/shadcnui-vue-ts-template' },
    ],
  },
})

// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ComponentDemo from './components/ComponentDemo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout)
  },
  enhanceApp({ app }) {
    app.component('ComponentDemo', ComponentDemo)
  },
} satisfies Theme

# XLoading

加载组件，纯 Tailwind 自绘 spinner（不依赖第三方 Spin）。支持独立展示与包裹遮罩两种模式。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loading | `boolean` | `false` | 是否处于加载状态 |
| size | `number` | `28` | spinner 尺寸（px） |
| text | `string` | `'加载中…'` | 加载提示文字，传空字符串则不显示 |
| textType | `'default' \| 'secondary'` | `'secondary'` | 文字语义色 |
| mask | `boolean` | `false` | 遮罩模式：绝对定位盖住父容器内容（父容器需 `position: relative`） |
| color | `string` | `'var(--primary)'` | spinner 颜色 |

其余属性（`class`、`style`）在独立模式下透传到根元素。

## Slots

| 名称 | 说明 |
|------|------|
| — | 无插槽（遮罩模式下被遮盖的内容放在父容器中） |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XLoading from '@/components/x/XLoading'

const loading = ref(true)
</script>

<template>
  <!-- 独立模式 -->
  <XLoading :loading="loading" text="数据加载中…" />

  <!-- 遮罩模式：盖住卡片内容 -->
  <div class="relative">
    <div>卡片内容…</div>
    <XLoading :loading="loading" mask />
  </div>
</template>
```

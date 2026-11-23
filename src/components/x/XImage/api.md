# XImage

原生 `img` 封装组件，统一尺寸 / 圆角 / 填充模式，支持加载失败占位与点击查看大图（基于 XImagePreviewDialog）。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | `string` | —（必填） | 图片地址 |
| alt | `string` | `''` | 替代文本 |
| width | `number` | `120` | 宽度（px），`0` 表示 100% 宽 |
| height | `number` | `120` | 高度（px），`0` 表示按宽度等比 |
| radius | `number` | `8` | 圆角（px） |
| fit | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | 填充模式，同 CSS `object-fit` |
| preview | `boolean` | `true` | 点击是否打开大图预览 |
| errorText | `string` | `'加载失败'` | 加载失败占位文字 |

其余属性（`class`、`style` 及原生 `img` 属性）透传到 `img` 元素。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| — | — | 原生事件透传（如 `@load`） |

## 使用示例

```vue
<script setup lang="ts">
import XImage from '@/components/x/XImage'
</script>

<template>
  <XImage src="/logo.svg" alt="logo" :width="80" :height="80" />

  <!-- 不允许点击预览 -->
  <XImage src="/banner.png" :width="0" :height="160" fit="cover" :preview="false" />
</template>
```

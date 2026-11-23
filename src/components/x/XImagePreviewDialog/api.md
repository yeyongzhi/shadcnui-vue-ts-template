# XImagePreviewDialog

幻灯片式图片预览弹窗，基于 shadcn-vue `Dialog`。支持多图切换、缩放、计数显示，暗色遮罩沉浸式预览。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | `boolean` | `false` | 是否打开，支持 `v-model:open` |
| images | `string[]` | `[]` | 图片地址列表 |
| initialIndex | `number` | `0` | 初始显示的图片下标 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:open | `(open: boolean)` | `v-model:open` 更新事件 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XImagePreviewDialog from '@/components/x/XImagePreviewDialog'

const open = ref(false)
const images = [
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
]
</script>

<template>
  <button @click="open = true">预览</button>
  <XImagePreviewDialog v-model:open="open" :images="images" />
</template>
```

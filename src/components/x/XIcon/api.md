# XIcon

图标组件，统一封装 `@lucide/vue` 图标。通过图标名称字符串使用图标，避免在业务代码中直接 import 图标组件；也支持传入自定义图标组件。项目规范：业务代码中禁止直接 `import { Xxx } from '@lucide/vue'`，统一使用本组件。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | `string` | — | lucide 图标名称（PascalCase，如 `'Search'`、`'CircleQuestionMark'`、`'Inbox'`） |
| size | `number \| string` | `16` | 图标尺寸（px） |
| color | `string` | `'currentColor'` | 图标颜色，默认跟随文字颜色 |
| strokeWidth | `number \| string` | `2` | 线条粗细 |
| component | `Component` | `undefined` | 自定义图标组件，传入后优先于 `name` |

其余属性（`class`、`style` 及原生 SVG 属性）透传到根元素。

## Slots

| 名称 | 说明 |
|------|------|
| — | 无插槽 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| — | — | 原生事件透传（如 `@click`） |

## 使用示例

```vue
<script setup lang="ts">
import XIcon from '@/components/x/XIcon'
</script>

<template>
  <XIcon name="Search" :size="18" />

  <!-- 跟随文字颜色 -->
  <span class="text-primary"><XIcon name="CircleQuestionMark" :size="14" /></span>

  <!-- 自定义图标组件 -->
  <XIcon :component="MyIcon" :size="20" />
</template>
```

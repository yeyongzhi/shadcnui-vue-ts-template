# XText

文本组件，纯 Tailwind 实现（对应 FrontCore 基于 NText 的 XText）。控制字号、语义颜色、加粗与删除线，其余属性透传到根 `span`。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'base'` | 字号，取值同 tailwindcss 的 `text-*` |
| type | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'default'` | 文字颜色；`default` 正文色，`secondary` 弱化色，其余对应语义色 |
| strong | `boolean` | `false` | 是否加粗 |
| del | `boolean` | `false` | 是否显示删除线 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根 `span`。

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 文本内容 |

## 使用示例

```vue
<script setup lang="ts">
import XText from '@/components/x/XText'
</script>

<template>
  <XText>默认文本</XText>
  <XText type="secondary">弱化说明文字</XText>
  <XText type="error" strong>错误提示</XText>
  <XText size="lg" del>已废弃的文案</XText>
</template>
```

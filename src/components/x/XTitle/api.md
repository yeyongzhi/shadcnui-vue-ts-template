# XTitle

标题 / 区块小标题组件。通过 `size` 控制字号（取值同 tailwindcss），`type` 控制语义颜色，`prefix` 控制是否显示左侧竖条装饰，颜色均跟随主题。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'base'` | 字号，取值同 tailwindcss 的 `text-*` |
| prefix | `boolean` | `false` | 是否在标题前显示一根竖条装饰，高度随字号、颜色随 `type` |
| type | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义类型，决定文字与竖条颜色。`default` 竖条用主题主色（`--primary`），其余对应语义色 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根元素。

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 标题文字内容 |
| `tooltip` | 传入后，标题末尾出现一个帮助图标，hover 显示该插槽内容 |
| `extra` | 标题右侧操作区，自动靠右对齐（如「查看全部」「编辑」等操作） |

## 使用示例

```vue
<script setup lang="ts">
import XTitle from '@/components/x/XTitle'
</script>

<template>
  <!-- 默认 base 字号 -->
  <XTitle>设备列表</XTitle>

  <!-- 带左侧竖条 -->
  <XTitle prefix>设备列表</XTitle>

  <!-- 大字号 + 竖条 -->
  <XTitle size="xl" prefix>设备管理</XTitle>

  <!-- 语义颜色：竖条变红 -->
  <XTitle prefix type="error">异常告警</XTitle>

  <!-- 带帮助提示 -->
  <XTitle prefix>
    数据质量
    <template #tooltip>统计口径说明……</template>
  </XTitle>
</template>
```

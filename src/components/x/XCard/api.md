# XCard

卡片组件，基于 shadcn-vue `Card` 封装。提供 `title` / `subtitle` 快捷属性（标题复用 XTitle，支持竖条装饰），以及 extra 操作区、footer 底部区插槽，简化常规卡片写法。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | `''` | 卡片标题；不传且无 `title` 插槽时不渲染头部 |
| subtitle | `string` | `''` | 卡片副标题（弱化色小字） |
| titleSize | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'` | `'base'` | 标题字号，同 XTitle 的 `size` |
| titlePrefix | `boolean` | `false` | 标题前竖条装饰 |
| padding | `'default' \| 'compact' \| 'none'` | `'default'` | 内边距模式：常规 / 紧凑 / 自行控制 |

其余属性（`class`、`style`）透传到根 `Card`。

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 卡片内容 |
| `title` | 自定义标题区（替换 `title` 属性渲染） |
| `extra` | 头部右侧操作区（有 `title` 时嵌入标题行右侧，无 `title` 时渲染在右上角） |
| `footer` | 底部操作区 |

## 使用示例

```vue
<script setup lang="ts">
import XCard from '@/components/x/XCard'
import XButton from '@/components/x/XButton'
</script>

<template>
  <XCard title="设备列表" title-prefix subtitle="共 12 台">
    <template #extra>
      <XButton size="sm">新增</XButton>
    </template>
    卡片内容…
  </XCard>
</template>
```

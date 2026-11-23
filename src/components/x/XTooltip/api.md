# XTooltip

基于 shadcn-vue `Tooltip` 封装的提示框。通过 `trigger` 插槽定义触发元素，默认插槽定义提示内容，支持四方向弹出与禁用。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| side | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | 弹出位置 |
| disabled | `boolean` | `false` | 是否禁用（禁用后不弹出） |
| delayDuration | `number` | `300` | 延迟弹出时长（毫秒） |

其余属性（`class`、`style`）透传到 `TooltipContent`。

## Slots

| 名称 | 说明 |
|------|------|
| `trigger` | 触发元素（建议单个可聚焦元素） |
| `default` | 提示内容 |

## 使用示例

```vue
<script setup lang="ts">
import XTooltip from '@/components/x/XTooltip'
import { Button } from '@/components/ui/button'
</script>

<template>
  <XTooltip side="right">
    <template #trigger>
      <Button variant="outline">悬停查看</Button>
    </template>
    这是一段提示文字
  </XTooltip>
</template>
```

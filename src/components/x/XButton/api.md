# XButton

按钮组件，基于 shadcn-vue `Button` 封装。新增图标快捷属性（免 import 图标组件）与加载状态。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 按钮变体，同 shadcn Button |
| size | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | 按钮尺寸，同 shadcn Button |
| icon | `string` | `undefined` | lucide 图标名称，渲染在文字前 |
| loading | `boolean` | `false` | 加载状态：显示旋转图标并禁用点击 |
| disabled | `boolean` | `false` | 是否禁用 |

其余属性（`class`、`style` 及原生 `button` 属性）透传到 `Button`。

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 按钮文字内容 |

## 使用示例

```vue
<script setup lang="ts">
import XButton from '@/components/x/XButton'
</script>

<template>
  <XButton>确认</XButton>

  <!-- 图标按钮 -->
  <XButton variant="outline" icon="Plus">新增</XButton>

  <!-- 加载状态 -->
  <XButton loading>保存中…</XButton>

  <!-- 危险操作 -->
  <XButton variant="destructive" icon="Trash2">删除</XButton>
</template>
```

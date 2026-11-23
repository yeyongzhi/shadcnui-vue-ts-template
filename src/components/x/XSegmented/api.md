# XSegmented

分段选择器，原生 button + Tailwind 实现，滑动选中态指示器。用于少量互斥选项的快速切换（如明暗模式切换）。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number \| null` | `undefined` | 当前选中值，支持 `v-model` |
| options | `XSegmentedOption[]` | `[]` | 选项列表，项含 `value` / `label` / `icon`（lucide 图标名）/ `disabled` |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| block | `boolean` | `false` | 是否撑满父级宽度 |
| disabled | `boolean` | `false` | 是否整体禁用 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根元素。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| number \| null)` | `v-model` 更新事件 |
| change | `(value: string \| number \| null)` | 选中项变化时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XSegmented from '@/components/x/XSegmented'

const mode = ref<'light' | 'dark' | 'auto'>('light')
</script>

<template>
  <XSegmented
    v-model="mode"
    :options="[
      { value: 'light', label: '亮色', icon: 'Sun' },
      { value: 'dark', label: '暗色', icon: 'Moon' },
      { value: 'auto', label: '系统', icon: 'Monitor' },
    ]"
  />
</template>
```

# XRadioGroup

常规单选框组（圆形指示点 + 标签），基于原生 `input[type="radio"]` 实现：同一 `name` 分组内自动互斥，支持键盘方向键在选项间切换。与 `XRadioBox`（胶囊按钮式单选）互补——需要表单原生样式时使用本组件。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number \| null` | `null` | 当前选中值，支持 `v-model`；`null` 表示未选择 |
| options | `XRadioGroupOption[]` | `[]` | 选项列表，项含 `value` / `label` / `disabled` |
| name | `string` | 自动生成 | 原生 radio 的 `name`，用于同组互斥 |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（圆点与字号） |
| disabled | `boolean` | `false` | 是否整体禁用 |

其余属性（`class`、`style` 等）透传到根元素。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| number)` | `v-model` 更新事件 |
| change | `(value: string \| number)` | 选中项变化时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XRadioGroup from '@/components/x/XRadioGroup'

const period = ref<'day' | 'week' | 'month'>('day')

const options = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
]
</script>

<template>
  <XRadioGroup v-model="period" :options="options" />

  <!-- 纵向排列 + 小尺寸 -->
  <XRadioGroup v-model="period" :options="options" direction="vertical" size="small" />
</template>
```
# XCheckboxGroup

常规多选框组（方形勾选框 + 标签），基于原生 `input[type="checkbox"]` 实现，`v-model` 绑定选中值数组。与单选区分：多个选项可独立勾选，不互斥。可选在顶部显示「全选」复选框，部分选中时呈 indeterminate 状态。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `(string \| number)[]` | `[]` | 当前选中的值数组，支持 `v-model` |
| options | `XCheckboxGroupOption[]` | `[]` | 选项列表，项含 `value` / `label` / `disabled` |
| name | `string` | 自动生成 | 原生 checkbox 的 `name` |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸（勾选框与字号） |
| disabled | `boolean` | `false` | 是否整体禁用 |
| showCheckAll | `boolean` | `false` | 是否在顶部显示「全选」复选框（只统计未禁用选项，部分选中时为 indeterminate） |
| checkAllLabel | `string` | `'全选'` | 全选文案 |

其余属性（`class`、`style` 等）透传到根元素。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: (string \| number)[])` | `v-model` 更新事件，返回最新的选中值数组 |
| change | `(value: (string \| number)[])` | 勾选状态变化时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XCheckboxGroup from '@/components/x/XCheckboxGroup'

const channels = ref<(string | number)[]>(['email'])

const options = [
  { value: 'email', label: '邮件' },
  { value: 'sms', label: '短信' },
  { value: 'inbox', label: '站内信', disabled: true },
]
</script>

<template>
  <XCheckboxGroup v-model="channels" :options="options" />

  <!-- 顶部显示「全选」，部分选中时 indeterminate（禁用项不计入） -->
  <XCheckboxGroup v-model="channels" :options="options" show-check-all />

  <!-- 纵向排列 + 小尺寸 -->
  <XCheckboxGroup v-model="channels" :options="options" direction="vertical" size="small" />
</template>
```
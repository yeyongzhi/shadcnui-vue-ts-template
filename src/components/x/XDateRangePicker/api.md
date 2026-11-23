# XDateRangePicker

日期范围选择组件。默认显示一个输入框样式的触发器（前后两段分别展示开始 / 结束日期），点击展开**双月面板**选择起止日期；面板底部实时回显所选区间，支持清空。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `XDateRangeValue` | `{ start: null, end: null }` | 起止日期，支持 `v-model`；`start` / `end` 为 `'YYYY-MM-DD'` 或 `null` |
| startPlaceholder | `string` | `'开始日期'` | 开始日期占位文案 |
| endPlaceholder | `string` | `'结束日期'` | 结束日期占位文案 |
| clearable | `boolean` | `true` | 是否可清空（面板底部显示清空按钮） |
| disabled | `boolean` | `false` | 是否禁用 |
| disableFuture | `boolean` | `false` | 禁用今天之后的日期 |

其余属性（`class`、`style`）透传到触发按钮。

## XDateRangeValue

```ts
interface XDateRangeValue {
  start: string | null  // 'YYYY-MM-DD'
  end: string | null
}
```

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: XDateRangeValue)` | `v-model` 更新事件（选择过程中实时回传，start 有值 end 为空表示只选了开始） |
| change | `(value: XDateRangeValue)` | 选值变化时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDateRangePicker from '@/components/x/XDateRangePicker'
import type { XDateRangeValue } from '@/components/x/XDateRangePicker'

const range = ref<XDateRangeValue>({ start: null, end: null })
</script>

<template>
  <XDateRangePicker v-model="range" class="w-72" :disable-future="true" />
</template>
```

# XDateRangePicker

日期范围选择组件。默认显示一个输入框样式的触发器（前后两段分别展示开始 / 结束日期），点击展开**双月面板**选择起止日期；面板底部提供近一周、近一个月、近三个月快捷范围，以及清空、取消和确认操作。日期选择会暂存在面板中，点击确认后才更新外部值。开启 `showTime` 后，可分别为开始和结束日期设置时分秒。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `XDateRangeValue` | `{ start: null, end: null }` | 起止日期，支持 `v-model`；`start` / `end` 为日期或日期时间字符串，也可为 `null` |
| startPlaceholder | `string` | `'开始日期'` | 开始日期占位文案 |
| endPlaceholder | `string` | `'结束日期'` | 结束日期占位文案 |
| clearable | `boolean` | `true` | 是否显示输入框末尾的清除图标和面板底部的清空按钮 |
| showTime | `boolean` | `false` | 是否支持时分秒精度；开启后双月面板各自显示当前时间，点击后弹出时、分、秒下拉框 |
| disabled | `boolean` | `false` | 是否禁用 |
| disableFuture | `boolean` | `false` | 禁用今天之后的日期 |

其余属性（`class`、`style`）透传到触发按钮。

## XDateRangeValue

```ts
interface XDateRangeValue {
  start: string | null  // 'YYYY-MM-DD' 或 showTime 开启时的 'YYYY-MM-DD HH:mm:ss'
  end: string | null
}
```

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: XDateRangeValue)` | 点击确认时更新 `v-model` |
| change | `(value: XDateRangeValue)` | 点击确认应用日期范围时触发 |

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

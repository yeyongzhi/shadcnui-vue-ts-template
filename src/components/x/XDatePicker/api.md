# XDatePicker

日期选择组件，基于 shadcn-vue `Popover` + `Calendar` 组合封装（对齐 FrontCore XDatePicker 的使用习惯）。默认选择日期并回传 `'YYYY-MM-DD'`；开启 `showTime` 后，可继续选择时、分、秒，并回传 `'YYYY-MM-DD HH:mm:ss'`。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| Date \| null` | `null` | 选中日期或日期时间（`'YYYY-MM-DD'`、`'YYYY-MM-DD HH:mm:ss'` 或 `Date`），支持 `v-model`；`null` 表示未选择 |
| placeholder | `string` | `'请选择日期'` | 占位文案 |
| clearable | `boolean` | `true` | 是否显示输入框末尾的清除图标和面板底部的清空按钮 |
| showTime | `boolean` | `false` | 是否支持时分秒精度；开启后日历右上角显示当前时间，点击后弹出时、分、秒三个下拉框；选择日期不会自动关闭日历 |
| disabled | `boolean` | `false` | 是否禁用 |
| disablePast | `boolean` | `false` | 禁用今天之前的日期 |

其余属性（`class`、`style`）透传到触发按钮。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| null)` | `v-model` 更新事件；日期模式回传 `'YYYY-MM-DD'`，时分秒模式回传 `'YYYY-MM-DD HH:mm:ss'` |
| change | `(value: string \| null)` | 选中项变化（含时间变化和清空）时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDatePicker from '@/components/x/XDatePicker'

const date = ref<string | null>(null)
</script>

<template>
  <XDatePicker v-model="date" class="w-48" :disable-past="true" :show-time="true" />
</template>
```

# XDatePicker

日期选择组件，基于 shadcn-vue `Popover` + `Calendar` 组合封装（对齐 FrontCore XDatePicker 的使用习惯）。v-model 值为 `'YYYY-MM-DD'` 字符串或 `Date`，变更后统一回传 `'YYYY-MM-DD'` 字符串。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| Date \| null` | `null` | 选中日期（`'YYYY-MM-DD'` 或 `Date`），支持 `v-model`；`null` 表示未选择 |
| placeholder | `string` | `'请选择日期'` | 占位文案 |
| clearable | `boolean` | `true` | 是否可清空（选中后弹层底部显示清空按钮） |
| disabled | `boolean` | `false` | 是否禁用 |
| disablePast | `boolean` | `false` | 禁用今天之前的日期 |

其余属性（`class`、`style`）透传到触发按钮。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| null)` | `v-model` 更新事件（回传 `'YYYY-MM-DD'`） |
| change | `(value: string \| null)` | 选中项变化（含清空）时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDatePicker from '@/components/x/XDatePicker'

const date = ref<string | null>(null)
</script>

<template>
  <XDatePicker v-model="date" class="w-48" :disable-past="true" />
</template>
```

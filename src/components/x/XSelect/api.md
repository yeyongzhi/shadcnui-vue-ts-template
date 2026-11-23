# XSelect

下拉选择组件，基于 shadcn-vue `Select` 封装。传入 `options` 数组即可使用，支持 v-model、可清空、禁用项；数字值自动还原类型。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number \| null` | `undefined` | 当前选中值，支持 `v-model`；`null` 表示未选中 |
| options | `XSelectOption[]` | `[]` | 选项列表，项含 `value` / `label` / `disabled` |
| placeholder | `string` | `'请选择'` | 占位文案 |
| clearable | `boolean` | `true` | 是否可清空（选中后悬浮触发器显示清空按钮） |
| disabled | `boolean` | `false` | 是否禁用 |
| size | `'sm' \| 'default'` | `'default'` | 触发器尺寸 |

其余属性（`class`、`style`）透传到触发器。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| number \| null)` | `v-model` 更新事件 |
| change | `(value: string \| number \| null)` | 选中项变化（含清空）时触发 |

## 类型定义

```ts
interface XSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}
```

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XSelect from '@/components/x/XSelect'

const status = ref<number | null>(1)
const statusOptions = [
  { value: 1, label: '在线' },
  { value: 0, label: '离线' },
  { value: 2, label: '维护中', disabled: true },
]
</script>

<template>
  <XSelect v-model="status" :options="statusOptions" class="w-48" />
</template>
```

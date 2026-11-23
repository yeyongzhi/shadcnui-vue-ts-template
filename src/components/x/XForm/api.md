# XForm

配置驱动表单组件（轻量实现，不引 vee-validate）。`fields` 数组描述表单项，支持 input / textarea / select / date / number / custom 六类控件；`required` 项在提交前校验。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `Record<string, any>` | —（必填） | 表单数据对象，支持 `v-model` |
| fields | `XFormField[]` | —（必填） | 表单项配置 |
| labelWidth | `number` | `90` | 标签宽度（px，`label-position: left` 时生效） |
| disabled | `boolean` | `false` | 是否禁用整个表单 |
| labelPosition | `'left' \| 'top'` | `'left'` | 标签位置 |

## XFormField 字段定义

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | `string` | — | 字段键名（对应 `modelValue` 中的 key） |
| label | `string` | — | 标签文案 |
| type | `'input' \| 'textarea' \| 'select' \| 'date' \| 'number' \| 'custom'` | `'input'` | 表单项类型 |
| placeholder | `string` | 按类型默认 | 占位文案 |
| required | `boolean` | `false` | 是否必填（校验失败 toast 提示） |
| disabled | `boolean` | `false` | 是否禁用该项 |
| options | `XSelectOption[]` | `[]` | `select` 类型的选项列表 |
| clearable | `boolean` | `true` | `select` 是否可清空 |
| rows | `number` | `3` | `textarea` 行数 |
| precision | `number` | `undefined` | `number` 小数位精度 |
| min / max | `number` | `undefined` | `number` 最小 / 最大值 |
| render | `(model) => VNode \| Component \| string` | `undefined` | `custom` 类型的自定义渲染 |

## Expose

| 方法 | 返回 | 说明 |
|------|------|------|
| validate() | `boolean` | 校验所有 `required` 项 |
| validateAndToast() | `boolean` | 校验并在失败时 toast 提示「请填写「标签」」 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XForm from '@/components/x/XForm'
import type { XFormField } from '@/components/x/XForm'

const model = ref({ name: '', level: null, count: 1, remark: '' })

const fields: XFormField[] = [
  { key: 'name', label: '设备名称', required: true },
  { key: 'level', label: '重要等级', type: 'select', options: [{ value: 1, label: '高' }, { value: 2, label: '低' }] },
  { key: 'count', label: '数量', type: 'number', min: 1, max: 99 },
  { key: 'remark', label: '备注', type: 'textarea', rows: 4 },
]

const formRef = ref()

const handleSubmit = () => {
  if (!formRef.value.validateAndToast()) return
  // 提交 model.value
}
</script>

<template>
  <XForm ref="formRef" v-model="model" :fields="fields" />
</template>
```

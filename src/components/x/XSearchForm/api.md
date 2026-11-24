# XSearchForm

查询区组件，基于 XForm 封装。表单项支持 XForm 的全部类型：输入、密码、多行文本、数字、下拉、单选、复选、多选、开关、日期、日期范围和自定义控件。内置查询 / 重置按钮与展开收起，Enter 键触发查询；只负责收集条件与发事件，不发业务请求。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `Record<string, any>` | —（必填） | 查询条件对象，支持 `v-model` |
| fields | `XFormField[]` | —（必填） | 查询字段配置，同 XForm 的 `fields` |
| collapsedCount | `number` | `3` | 折叠时可见的字段数 |
| searchText | `string` | `'查询'` | 查询按钮文案；传空字符串则不渲染 |
| resetText | `string` | `'重置'` | 重置按钮文案；传空字符串则不渲染 |
| collapsible | `boolean` | `true` | 是否显示展开/收起按钮 |
| columns | `number` | `4` | 每行表单项数，窄容器自动降为单列 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: Record<string, any>)` | `v-model` 更新事件 |
| search | `(value: Record<string, any>)` | 点击查询或按 Enter 时触发 |
| reset | — | 点击重置时触发（model 已恢复为挂载时的初始快照） |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XSearchForm from '@/components/x/XSearchForm'
import type { XFormField } from '@/components/x/XForm'

const query = ref({ keyword: '', level: null, date: null })

const fields: XFormField[] = [
  { key: 'keyword', label: '关键词' },
  { key: 'level', label: '等级', type: 'select', options: [{ value: 1, label: '高' }, { value: 2, label: '低' }] },
  { key: 'date', label: '日期', type: 'date' },
]

const handleSearch = (value: Record<string, any>) => {
  // 拉取列表数据
}
</script>

<template>
  <XSearchForm v-model="query" :fields="fields" @search="handleSearch" />
</template>
```

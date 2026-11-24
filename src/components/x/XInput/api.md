# XInput

输入框组件，基于 shadcn-vue `Input` 封装。新增可清空按钮，统一占位文案，支持 v-model。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number \| null` | `''` | 输入值，支持 `v-model` |
| placeholder | `string` | `'请输入'` | 占位文字 |
| clearable | `boolean` | `true` | 是否显示输入框末尾的清除图标（有值时显示） |
| disabled | `boolean` | `false` | 是否禁用 |
| readonly | `boolean` | `false` | 是否只读 |

其余属性（`type`、`maxlength` 等）透传到 `Input`。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string)` | `v-model` 更新事件 |
| change | `(value: string)` | 输入完成（change）时触发 |
| enter | `(value: string)` | 按下 Enter 键时触发（常用于搜索框回车查询） |
| clear | — | 点击清空按钮时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XInput from '@/components/x/XInput'

const keyword = ref('')
</script>

<template>
  <XInput v-model="keyword" class="w-60" placeholder="搜索设备名称" @enter="doSearch" />
</template>
```

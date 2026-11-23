# XRadioBox

胶囊样式单选按钮组，原生 button + Tailwind 实现（不依赖第三方组件库）。选中项为主色胶囊，未选中项为灰色胶囊。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number` | `undefined` | 当前选中值，支持 `v-model` |
| options | `XRadioBoxOption[]` | `[]` | 选项列表，项含 `value` / `label` / `disabled` |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| block | `boolean` | `false` | 是否撑满父级宽度（每项等分） |
| disabled | `boolean` | `false` | 是否整体禁用 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根元素。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: string \| number)` | `v-model` 更新事件 |
| change | `(value: string \| number)` | 选中项变化时触发 |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XRadioBox from '@/components/x/XRadioBox'

const level = ref<'all' | 'high'>('all')
</script>

<template>
  <XRadioBox
    v-model="level"
    :options="[
      { value: 'all', label: '全部' },
      { value: 'high', label: '仅高风险' },
    ]"
  />
</template>
```

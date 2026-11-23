# XDrawer

抽屉组件，基于 shadcn-vue `Sheet` 封装。四方向弹出，内置标题 / 描述 / 内容区 / 底部确认取消操作区，结构与 XDialog 保持一致。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | `boolean` | `false` | 是否打开，支持 `v-model:open` |
| side | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 弹出方向 |
| title | `string` | `''` | 标题 |
| description | `string` | `''` | 描述文字 |
| size | `number` | `480` | 抽屉尺寸：左右方向为宽度，上下方向为高度（px） |
| confirmText | `string` | `'确认'` | 确认按钮文案；传空字符串则不渲染确认按钮 |
| cancelText | `string` | `'取消'` | 取消按钮文案；传空字符串则不渲染取消按钮 |
| confirmLoading | `boolean` | `false` | 确认中状态：确认按钮转圈且不可关闭抽屉 |
| loading | `boolean` | `false` | 内容加载状态：内容区显示 loading 遮罩 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:open | `(open: boolean)` | `v-model:open` 更新事件 |
| confirm | — | 点击确认按钮时触发 |
| cancel | — | 点击取消或关闭抽屉时触发 |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 抽屉内容 |
| `footer` | 自定义底部操作区（替换默认确认取消按钮） |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDrawer from '@/components/x/XDrawer'

const open = ref(false)
</script>

<template>
  <XDrawer v-model:open="open" title="设备详情" :size="520" :confirm-text="''">
    <div class="space-y-3">详情内容…</div>
  </XDrawer>
</template>
```

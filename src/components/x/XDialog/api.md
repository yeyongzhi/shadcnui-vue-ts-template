# XDialog

对话框组件，基于 shadcn-vue `Dialog` 封装。内置标题 / 描述 / 内容区 / 确认取消按钮完整结构，支持确认 loading、内容 loading、危险操作确认。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| open | `boolean` | `false` | 是否打开，支持 `v-model:open` |
| title | `string` | `''` | 标题 |
| description | `string` | `''` | 描述文字（标题下方的说明） |
| width | `number` | `480` | 弹窗宽度（px） |
| confirmText | `string` | `'确认'` | 确认按钮文案；传空字符串则不渲染确认按钮 |
| cancelText | `string` | `'取消'` | 取消按钮文案；传空字符串则不渲染取消按钮 |
| confirmVariant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 确认按钮变体（危险操作传 `'destructive'`） |
| confirmLoading | `boolean` | `false` | 确认中状态：确认按钮转圈且不可关闭弹窗 |
| loading | `boolean` | `false` | 内容加载状态：内容区显示 loading 遮罩 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:open | `(open: boolean)` | `v-model:open` 更新事件 |
| confirm | — | 点击确认按钮时触发（配合 `confirm-loading` 完成后自行关闭） |
| cancel | — | 点击取消或关闭弹窗时触发 |

## Slots

| 名称 | 说明 |
|------|------|
| `default` | 弹窗内容 |
| `footer` | 自定义底部操作区（替换默认确认取消按钮） |

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDialog from '@/components/x/XDialog'

const open = ref(false)
const saving = ref(false)

const handleConfirm = async () => {
  saving.value = true
  await doSave()
  saving.value = false
  open.value = false
}
</script>

<template>
  <XDialog
    v-model:open="open"
    title="编辑设备"
    description="修改设备基础信息"
    :confirm-loading="saving"
    @confirm="handleConfirm"
  >
    <div class="space-y-3">表单内容…</div>
  </XDialog>
</template>
```

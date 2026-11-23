# XCopyText

点击复制文本组件。展示一段文本和复制图标按钮，点击写入剪贴板（优先 Clipboard API，不支持时回退 `execCommand`），成功后图标短暂切换为对勾并通过 toast 提示。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | `string` | —（必填） | 要复制的文本内容 |
| showText | `string` | `undefined` | 显示的文本，不传则显示 `text` 本身 |
| icon | `string` | `'Copy'` | 复制按钮图标（lucide 图标名） |
| successIcon | `string` | `'Check'` | 复制成功后的反馈图标（lucide 图标名） |
| size | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'base'` | 文字尺寸，图标大小自动匹配 |
| feedbackDuration | `number` | `2000` | 成功图标显示时长（毫秒） |
| showMessage | `boolean` | `true` | 是否显示 toast 消息提示 |
| successMessage | `string` | `'复制成功'` | 复制成功的提示文案 |
| errorMessage | `string` | `'复制失败'` | 复制失败的提示文案 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根 `span`。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| copy-success | `(text: string)` | 复制成功时触发 |
| copy-error | `(error: Error)` | 复制失败时触发 |

## 使用示例

```vue
<script setup lang="ts">
import XCopyText from '@/components/x/XCopyText'
</script>

<template>
  <!-- 复制的内容和显示的内容一致 -->
  <XCopyText text="SN202401150001" />

  <!-- 显示脱敏文案，复制完整内容 -->
  <XCopyText text="13800000000" show-text="138****0000" />

  <!-- 不弹 toast，监听事件自行处理 -->
  <XCopyText text="secret" :show-message="false" @copy-success="onCopied" />
</template>
```

# XClearButton

输入类控件右侧的「清除」图标按钮（内部组件）。悬停或聚焦时可见，点击或按 `Enter` / `Space` 触发 `clear`；`XInput`、`XSelect`、`XDatePicker`、`XDateRangePicker` 等已内置使用。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|------|------|
| label | `string` | —（必填） | 无障碍名称，写入 `aria-label`（如「清除日期」） |
| class | `string` | — | 透传类名，常用于定位（如 `absolute right-2 top-1/2 -translate-y-1/2`） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| clear | `()` | 点击、`Enter` 或 `Space` 激活时触发 |

## 使用示例

```vue
<script setup lang="ts">
import XClearButton from '@/components/x/XClearButton'

const handleClear = () => {
  // 清空对应输入值
}
</script>

<template>
  <div class="relative">
    <input class="w-full rounded-md border px-3 py-2 pr-8" />
    <XClearButton
      label="清空"
      class="absolute right-2 top-1/2 -translate-y-1/2"
      @clear="handleClear"
    />
  </div>
</template>
```
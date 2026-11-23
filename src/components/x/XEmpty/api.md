# XEmpty

纯自绘空状态组件，不依赖第三方空状态组件。用于列表、图表、详情区块等无数据场景，支持控制图标和描述的显示，并可通过插槽扩展内容。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| description | `string` | `'暂无数据'` | 空状态描述文字 |
| showDescription | `boolean` | `true` | 是否显示描述文字 |
| showIcon | `boolean` | `true` | 是否显示图标 |

其余属性（`class`、`style` 及原生 HTML 属性）透传到根元素。

## Slots

| 名称 | 说明 |
|------|------|
| `icon` | 自定义空状态图标；受 `showIcon` 控制 |
| `extra` | 描述下方的额外操作或说明内容 |

## 使用示例

```vue
<script setup lang="ts">
import XEmpty from '@/components/x/XEmpty'
import XButton from '@/components/x/XButton'
</script>

<template>
  <XEmpty description="暂无维修记录">
    <template #extra>
      <XButton>立即新增</XButton>
    </template>
  </XEmpty>
</template>
```

```vue
<XEmpty description="暂无图表数据" :show-icon="false" />
```

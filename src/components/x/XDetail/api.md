# XDetail

键值对详情展示组件（对齐 FrontCore XDetail 的核心能力）。配置 `fields` 字段数组 + `data` 数据对象即可渲染描述列表，支持 text / slot / image 三类字段、`column` 快捷列数、标签位置切换与字段格式化。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fields | `XDetailField[]` | —（必填） | 字段配置列表，详见下方 XDetailField 说明 |
| data | `Record<string, any>` | `{}` | 详情数据对象，key 与 `field.key` 对应 |
| bordered | `boolean` | `false` | 是否显示字段底部分隔线 |
| labelPlacement | `'left' \| 'top'` | `'left'` | 标签位置：`left` 在值左侧（固定列宽），`top` 在值上方 |
| column | `number` | `undefined` | 快捷列数：每行显示几列，自动推算 span（`column=2` → 每项跨 2 列）；`field.span` 显式声明时优先级更高 |
| size | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'` | `'base'` | 详情文字字号，统一作用于标签、值和插槽内容 |
| labelWidth | `number` | `96` | 标签列宽（px，`label-placement: left` 时生效） |

其余属性（`class`、`style`）透传到根网格元素。

## XDetailField 字段定义

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | `string` | — | 字段标签；传空字符串时不渲染标签（仅渲染值） |
| key | `string` | — | 取值键名（对应 `data` 中的 key），也是 `slot` 类型的插槽名 |
| type | `'text' \| 'slot' \| 'image'` | `'text'` | 展示类型；`slot` 启用自定义插槽，`image` 显示图片缩略图 |
| span | `number` | 普通字段 1，image 字段 4（占满一行） | 占据的列跨度（一行按 4 等分计，最大 4）；显式声明覆盖 `column` 推算结果 |
| placeholder | `string` | `'-'` | 空值占位文案 |
| formatter | `(value, data) => any` | `undefined` | 文本字段格式化展示，仅影响回显、不修改原始数据 |

## Slots

| 名称 | 参数 | 说明 |
|------|------|------|
| `slot-{key}` | `{ value, field }` | `type: 'slot'` 字段的自定义渲染，插槽名为 `slot-` + 字段 key |

## image 字段

数据支持**单个 URL、URL 数组、JSON 数组字符串**三种形态（后端常把多图存成 JSON 字符串，直接透传即可），自动过滤空地址：

```ts
// 三种等价数据形态
data.photo = 'https://example.com/a.jpg'
data.photo = ['https://example.com/a.jpg', 'https://example.com/b.jpg']
data.photo = '["https://example.com/a.jpg", ""]' // 空地址自动过滤
```

缩略图 64×64 圆角横排展示，点击打开大图预览（XImagePreviewDialog）；字段无图时渲染占位文案。

## 使用示例

### 基础用法（column 快捷排列）

```vue
<script setup lang="ts">
import XDetail from '@/components/x/XDetail'
import type { XDetailField } from '@/components/x/XDetail'

// 不需要逐个手写 span，column=2 自动每行 2 列
const fields: XDetailField[] = [
  { label: '设备名称', key: 'name' },
  { label: '设备编号', key: 'sn' },
  { label: '所属区域', key: 'area' },
  { label: '安装时间', key: 'installDate' },
  { label: '备注', key: 'remark', span: 4 }, // 单独覆盖：占满整行
]

const data = {
  name: '一号风机',
  sn: 'WT-2024-001',
  area: '西北片区',
  installDate: '2024-03-15',
  remark: '已完成年度校准',
}
</script>

<template>
  <XDetail :fields="fields" :data="data" :column="2" bordered />
</template>
```

### 自定义插槽 + 格式化

```vue
<script setup lang="ts">
import XDetail from '@/components/x/XDetail'
import XText from '@/components/x/XText'
import type { XDetailField } from '@/components/x/XDetail'

const fields: XDetailField[] = [
  { label: '设备名称', key: 'name' },
  { label: '安装时间', key: 'installDate', formatter: v => `${v}（验收合格）` },
  { label: '运行状态', key: 'status', type: 'slot' },
  { label: '现场照片', key: 'photos', type: 'image' },
]

const data = {
  name: '一号风机',
  installDate: '2024-03-15',
  status: 1,
  photos: '["https://example.com/a.jpg"]',
}
</script>

<template>
  <XDetail :fields="fields" :data="data" :column="2">
    <template #slot-status="{ value }">
      <XText :type="value === 1 ? 'success' : 'error'" strong>
        {{ value === 1 ? '在线' : '离线' }}
      </XText>
    </template>
  </XDetail>
</template>
```

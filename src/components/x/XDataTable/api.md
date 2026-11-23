# XDataTable

数据表格组件，基于 shadcn-vue `Table` + `Pagination` 封装（不引 TanStack Table）。columns 配置驱动渲染，内置头部工具条（标题 / 总数 / 刷新 / 导出 / 列筛选）、分页器与空态 / 加载态；前端分页（传 `data`）与服务端分页（传 `total`）均可。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `XDataTableColumn[]` | —（必填） | 列配置 |
| data | `Record<string, any>[]` | `[]` | 行数据 |
| rowKey | `string` | `'id'` | 行唯一键字段名 |
| title | `string` | `''` | 表格标题（头部左侧，优先级低于 `header` 插槽） |
| showTotal | `boolean` | `true` | 是否在标题右侧显示数据总数 |
| columnFilter | `boolean` | `true` | 是否开启列筛选（头部右侧列可见性切换按钮） |
| tableRefresh | `boolean` | `true` | 是否显示刷新按钮 |
| tableExport | `boolean` | `false` | 是否显示导出按钮（默认导出当前可见列数据为 xlsx；父组件监听 `@export` 则交给外部处理） |
| loading | `boolean` | `false` | 加载状态（表格区显示遮罩） |
| emptyText | `string` | `'暂无数据'` | 空数据描述 |
| striped | `boolean` | `false` | 斑马纹 |
| pagination | `boolean \| Partial<XDataTablePagination>` | `{ page: 1, pageSize: 10 }` | 分页配置；传 `false` 关闭分页 |
| total | `number` | `undefined` | 总条数。传入即视为服务端分页（数据由外部按页提供）；不传则前端自动分页 |

## XDataTableColumn 列定义

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | `string` | — | 列标识（对应行数据的 key） |
| title | `string` | — | 列标题 |
| width | `number` | `undefined` | 列宽度（px） |
| align | `'left' \| 'center' \| 'right'` | `'left'` | 对齐方式 |
| render | `(row, index) => VNode \| string` | `undefined` | 自定义单元格渲染 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:pagination | `(value: XDataTablePagination)` | 分页变化（翻页 / 改每页条数）时触发，服务端分页据此重新拉数据 |
| row-click | `(row, index)` | 行点击 |
| refresh | — | 点击刷新按钮时触发（配合 `loading` 展示刷新中） |
| export | — | 点击导出按钮时触发；父组件监听此事件则默认 xlsx 导出行为不生效 |

## Slots

| 名称 | 参数 | 说明 |
|------|------|------|
| header | — | 头部左侧自定义内容（替换 `title`） |
| header-extra | `{ total }` | 标题附加区（紧邻总数展示状态、统计说明等） |
| operator | — | 头部右侧自定义操作区（刷新 / 筛选按钮之前，如批量操作按钮） |

## 头部工具条

头部右侧默认显示三个图标按钮（均可通过 props 关闭）：

- **导出**（`table-export`，默认关）：未监听 `@export` 时内置行为为把当前可见列数据导出为 `xlsx` 文件（按需动态加载 xlsx 依赖，不影响首屏体积）；监听后由外部自行处理
- **刷新**（`table-refresh`，默认开）：emit `refresh`，配合 `loading` 展示刷新中
- **列筛选**（`column-filter`，默认开）：Popover 内 Checkbox 列表控制列可见性，至少保留一列；「全选」在全部可见时收起为仅第一列

## 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XDataTable from '@/components/x/XDataTable'
import XButton from '@/components/x/XButton'
import { h } from 'vue'

const loading = ref(false)
const columns = [
  { key: 'name', title: '设备名称' },
  { key: 'sn', title: '编号', width: 160 },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    align: 'center',
    render: row => h(XButton, { size: 'sm', variant: 'ghost' }, () => '详情'),
  },
]

const data = ref([{ id: 1, name: '一号风机', sn: 'WT-001' }])

const handleRefresh = async () => {
  loading.value = true
  await fetchData()
  loading.value = false
}
</script>

<template>
  <XDataTable
    title="设备列表"
    :columns="columns"
    :data="data"
    :loading="loading"
    striped
    table-export
    @refresh="handleRefresh"
  >
    <template #operator>
      <XButton size="sm">批量删除</XButton>
    </template>
  </XDataTable>
</template>
```

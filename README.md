# shadcn-vue + Vue 3 + TypeScript 模板

一个基于 Vue 3、TypeScript、Vite、Tailwind CSS 和 shadcn-vue 的前端项目模板，包含主题切换、常用业务组件和组件预览页。X 系列组件的源码位于 `src/components/x`，可以直接在项目中按需组合和调整。

## 环境要求

- Node.js 20.19+ 或 22.12+
- pnpm 10+

## 快速开始

```bash
pnpm install
pnpm dev
```

开发服务器启动后，按终端输出的本地地址打开预览。

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | 执行 Vue 类型检查并构建生产文件 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm docs:dev` | 同步组件文档并启动 VitePress 文档站 |
| `pnpm docs:build` | 同步组件文档并构建文档站 |
| `pnpm docs:preview` | 本地预览 VitePress 构建 |

## 技术栈

- Vue 3、Composition API、`<script setup>`、TypeScript
- Vite 8、pnpm
- Tailwind CSS 4、shadcn-vue 风格组件、Reka UI
- Pinia、VueUse、Vue Sonner
- `@internationalized/date`：日历和日期值处理

## X 系列组件

组件源码集中在 `src/components/x/<组件名>`。有单独 API 文档的组件可点击名称查看属性、事件和示例。

### 输入与表单

| 组件 | 用途 |
| --- | --- |
| [XInput](src/components/x/XInput/api.md) | 文本输入，支持清空、禁用和 v-model |
| [XSelect](src/components/x/XSelect/api.md) | 下拉选择，支持字符串/数字选项、清空和禁用项 |
| [XRadioBox](src/components/x/XRadioBox/api.md) | 胶囊样式的单选组 |
| [XSegmented](src/components/x/XSegmented/api.md) | 少量互斥选项的分段切换 |
| [XDatePicker](src/components/x/XDatePicker/api.md) | 单日期选择；`showTime` 开启后支持时分秒 |
| [XDateRangePicker](src/components/x/XDateRangePicker/api.md) | 双月日期范围选择，支持快捷范围和可选时分秒 |
| [XForm](src/components/x/XForm/api.md) | 配置驱动表单，支持文本、密码、数字、下拉、单选、复选、多选、开关、日期、日期范围和自定义项 |
| [XSearchForm](src/components/x/XSearchForm/api.md) | 查询表单，提供查询、重置、回车提交和展开/收起 |

### 内容与数据展示

| 组件 | 用途 |
| --- | --- |
| [XCard](src/components/x/XCard/api.md) | 带标题、操作区和底部插槽的卡片容器 |
| [XDataTable](src/components/x/XDataTable/api.md) | 配置驱动表格，支持分页、刷新、导出入口、列筛选、加载和空状态 |
| [XDetail](src/components/x/XDetail/api.md) | 配置驱动的键值对详情展示 |
| [XText](src/components/x/XText/api.md) | 统一文本字号、语义颜色、加粗和删除线样式 |
| [XTitle](src/components/x/XTitle/api.md) | 标题和区块小标题 |
| [XImage](src/components/x/XImage/api.md) | 图片尺寸、填充和失败状态封装，可打开大图预览 |
| [XImagePreviewDialog](src/components/x/XImagePreviewDialog/api.md) | 图片预览弹窗，支持切图和缩放 |
| [XCopyText](src/components/x/XCopyText/api.md) | 点击复制文本并显示复制结果反馈 |
| [XEmpty](src/components/x/XEmpty/api.md) | 空数据状态 |
| [XLoading](src/components/x/XLoading/api.md) | 加载指示器和内容遮罩 |
| [XTooltip](src/components/x/XTooltip/api.md) | 四方向提示浮层 |

### 交互与布局

| 组件 | 用途 |
| --- | --- |
| [XButton](src/components/x/XButton/api.md) | 按钮变体、尺寸、图标和加载状态 |
| [XDialog](src/components/x/XDialog/api.md) | 对话框，提供确认/取消结构和加载状态 |
| [XDrawer](src/components/x/XDrawer/api.md) | 四方向抽屉，提供内容区和底部操作区 |
| [XIcon](src/components/x/XIcon/api.md) | 按名称渲染 Lucide 图标或自定义图标 |

`XClearButton` 是供输入、选择和日期组件复用的内部清除控件，不作为业务组件 API 单独使用。

## 使用约定

### 按需导入

从组件目录导入，不需要在全局注册：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import XInput from '@/components/x/XInput'
import XSelect from '@/components/x/XSelect'

const keyword = ref('')
const status = ref<number | null>(null)
const statusOptions = [
  { value: 1, label: '启用' },
  { value: 0, label: '停用' },
]
</script>

<template>
  <XInput v-model="keyword" class="max-w-sm" clearable placeholder="输入关键词" />
  <XSelect v-model="status" class="w-48" :options="statusOptions" placeholder="选择状态" />
</template>
```

控件默认填满父容器；通过 `class` 给组件或外层容器指定宽度，例如 `w-48`、`max-w-sm`。`clearable` 控制清除入口。日期组件开启 `showTime` 后，值格式为 `YYYY-MM-DD HH:mm:ss`；日期范围的开始和结束值分别遵循该格式。

### XForm 字段配置

```ts
import type { XFormField } from '@/components/x/XForm'

const fields: XFormField[] = [
  { key: 'name', label: '名称', required: true },
  { key: 'status', label: '状态', type: 'select', options: [
    { value: 'active', label: '启用' },
    { value: 'inactive', label: '停用' },
  ] },
  { key: 'features', label: '功能', type: 'checkbox-group', options: [
    { value: 'alarm', label: '告警' },
    { value: 'report', label: '报表' },
  ] },
  { key: 'time', label: '发生时间', type: 'date', showTime: true },
]
```

表单值由 `v-model` 维护。调用 `validate()` 检查必填项，或调用 `validateAndToast()` 检查并提示。具体字段属性见 [XForm API](src/components/x/XForm/api.md)。

### XSearchForm 查询

XSearchForm 复用 XForm 的字段配置。它只收集和发出查询条件，不负责请求接口：

```vue
<XSearchForm
  v-model="query"
  :fields="fields"
  :collapsed-count="4"
  :columns="3"
  @search="loadData"
  @reset="resetData"
/>
```

点击“查询”或在字段内按 Enter 会触发 `search`；点击“重置”恢复组件挂载时的初始值并触发 `reset`。字段展开、按钮文案和列数可通过 props 调整。

### 图标与主题

- 按钮和业务组件通过 `icon="Search"` 这类名称使用图标；业务代码统一使用 XIcon，不直接从 `@lucide/vue` 导入单个图标。
- 主题模式和主题色由项目 Pinia 主题 store 管理；组件颜色使用语义化主题变量，适配亮色和暗色模式。
- 优先使用现有 `src/components/ui` 基础组件和 `src/components/x` 业务组件，避免重复实现相同交互。

## 项目目录

```text
src/
├─ App.vue       # 组件预览页与主应用
├─ components/
│  ├─ ui/       # shadcn-vue 风格基础组件
│  └─ x/        # 项目 X 系列业务组件
├─ assets/      # 图片等静态资源
├─ lib/         # 通用工具
├─ plugins/     # 插件和全局消息封装
├─ store/       # Pinia 状态
├─ style/       # Sass 样式
├─ style.css    # Tailwind 入口
└─ main.ts      # 应用入口
```

组件预览页面可通过 `pnpm dev` 启动后查看；每个组件的详细 API 和示例位于相应目录的 `api.md`。

## 相关资源

- [shadcn-vue 文档](https://www.shadcn-vue.com/docs/installation/vite)
- [Reka UI 文档](https://www.reka-ui.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vue 3 文档](https://vuejs.org/)

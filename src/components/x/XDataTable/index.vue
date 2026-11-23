<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance, type PropType } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import XEmpty from '@/components/x/XEmpty'
import XLoading from '@/components/x/XLoading'
import XIcon from '@/components/x/XIcon'
import XText from '@/components/x/XText'
import XTooltip from '@/components/x/XTooltip'
import {
  X_DATA_TABLE_DEFAULT_PAGE_SIZE,
  X_DATA_TABLE_PAGE_SIZE_OPTIONS,
  type XDataTableColumn,
  type XDataTablePagination,
} from './constant'

const props = defineProps({
  /** 列配置 */
  columns: {
    type: Array as PropType<XDataTableColumn[]>,
    required: true,
  },
  /** 行数据 */
  data: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => [],
  },
  /** 行唯一键（默认取 id 字段） */
  rowKey: {
    type: String,
    default: 'id',
  },
  /** 表格标题（头部左侧，优先级低于 header 插槽） */
  title: {
    type: String,
    default: '',
  },
  /** 是否在标题右侧显示数据总数 */
  showTotal: {
    type: Boolean,
    default: true,
  },
  /** 是否开启列筛选（头部右侧显示列可见性切换按钮） */
  columnFilter: {
    type: Boolean,
    default: true,
  },
  /** 是否显示刷新按钮 */
  tableRefresh: {
    type: Boolean,
    default: true,
  },
  /** 是否显示导出按钮（默认行为：当前可见列数据导出 xlsx；父组件监听 @export 则交给外部处理） */
  tableExport: {
    type: Boolean,
    default: false,
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 空数据描述 */
  emptyText: {
    type: String,
    default: '暂无数据',
  },
  /** 斑马纹 */
  striped: {
    type: Boolean,
    default: false,
  },
  /** 是否显示分页（关闭后由外部自行处理） */
  pagination: {
    type: [Boolean, Object] as PropType<boolean | Partial<XDataTablePagination>>,
    default: () => ({ page: 1, pageSize: X_DATA_TABLE_DEFAULT_PAGE_SIZE }),
  },
  /** 总条数（服务端分页时必传；不传则按 data.length 前端分页） */
  total: {
    type: Number,
    default: undefined,
  },
})

const emit = defineEmits<{
  /** 分页变化（含每页条数变化） */
  (e: 'update:pagination', value: XDataTablePagination): void
  /** 行点击 */
  (e: 'row-click', row: Record<string, any>, index: number): void
  /** 点击刷新按钮 */
  (e: 'refresh'): void
  /** 点击导出按钮（父组件监听则默认导出行为不生效） */
  (e: 'export'): void
}>()

const slots = defineSlots<{
  /** 头部左侧自定义内容（替换 title） */
  header?: () => any
  /** 标题附加区（紧邻总数展示） */
  'header-extra'?: (props: { total: number }) => any
  /** 头部右侧自定义操作区（刷新/筛选按钮之前） */
  operator?: () => any
}>()

// 分页配置归一
const paginationEnabled = computed(() => props.pagination !== false)
const paginationState = ref<XDataTablePagination>({
  page: (typeof props.pagination === 'object' ? props.pagination.page : undefined) ?? 1,
  pageSize: (typeof props.pagination === 'object' ? props.pagination.pageSize : undefined) ?? X_DATA_TABLE_DEFAULT_PAGE_SIZE,
})
watch(() => props.pagination, (v) => {
  if (typeof v === 'object' && v) {
    paginationState.value.page = v.page ?? paginationState.value.page
    paginationState.value.pageSize = v.pageSize ?? paginationState.value.pageSize
  }
})

const totalCount = computed(() => props.total ?? props.data.length)
const serverPaged = computed(() => props.total !== undefined)

// 前端分页时截取数据；服务端分页直接用 data
const pageData = computed(() => {
  if (!paginationEnabled.value || serverPaged.value) return props.data
  const start = (paginationState.value.page - 1) * paginationState.value.pageSize
  return props.data.slice(start, start + paginationState.value.pageSize)
})

const pageCount = computed(() =>
  Math.max(Math.ceil(totalCount.value / paginationState.value.pageSize), 1),
)

const notifyPagination = () => {
  emit('update:pagination', { ...paginationState.value })
}

const handlePageChange = (page: number) => {
  paginationState.value.page = page
  notifyPagination()
}

const handlePageSizeChange = (pageSize: number) => {
  paginationState.value.pageSize = pageSize
  paginationState.value.page = 1
  notifyPagination()
}

// ========== 头部工具条 ==========
const showHeader = computed(() =>
  !!slots.header
  || !!slots['header-extra']
  || !!slots.operator
  || !!props.title
  || props.showTotal
  || props.columnFilter
  || props.tableRefresh
  || props.tableExport,
)

// ========== 列筛选逻辑（参考 FrontCore） ==========
const visibleKeys = ref<Set<string>>(new Set())

// columns 变化时重置为全部可见
watch(
  () => props.columns,
  (cols) => {
    visibleKeys.value = new Set(cols.map(col => col.key))
  },
  { immediate: true },
)

// 筛选后的列（保持传入顺序）
const filteredColumns = computed(() =>
  props.columns.filter(col => visibleKeys.value.has(col.key)),
)

const toggleColumn = (key: string) => {
  const next = new Set(visibleKeys.value)
  if (next.has(key)) {
    // 至少保留一列，防止全部隐藏
    if (next.size <= 1) return
    next.delete(key)
  }
  else {
    next.add(key)
  }
  visibleKeys.value = next
}

// 全选 / 全不选：全选时收起为仅第一列，非全选时展开全部
const toggleAll = () => {
  if (visibleKeys.value.size === props.columns.length) {
    const first = props.columns[0]
    visibleKeys.value = first ? new Set([first.key]) : new Set()
  }
  else {
    visibleKeys.value = new Set(props.columns.map(col => col.key))
  }
}

// ========== 导出逻辑（参考 FrontCore：监听 @export 则交给外部，否则导出 xlsx） ==========
const instance = getCurrentInstance()

const handleExportClick = async () => {
  if (instance?.vnode.props?.onExport) {
    emit('export')
    return
  }
  // 默认行为：动态引入 xlsx，把当前可见列数据导出为 xlsx
  const XLSX = await import('xlsx')
  const cols = filteredColumns.value
  const headers = cols.map(col => col.title || col.key)
  const rows = props.data.map(row =>
    cols.map((col) => {
      const val = row[col.key]
      return val === undefined || val === null ? '' : val
    }),
  )
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${props.title || '导出数据'}.xlsx`)
}

// ========== 渲染 ==========
const cellAlign = (col: XDataTableColumn) =>
  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'

const renderCell = (col: XDataTableColumn, row: Record<string, any>, index: number) => {
  if (col.render) return col.render(row, index)
  const value = row[col.key]
  return value === undefined || value === null || value === '' ? '-' : String(value)
}
</script>

<template>
  <div class="x-data-table flex w-full min-h-0 flex-col gap-y-2">
    <!-- 头部工具条：标题 + 总数 + 刷新 / 导出 / 列筛选 -->
    <div v-if="showHeader" class="flex shrink-0 items-center justify-between gap-x-4">
      <div class="flex min-w-0 flex-1 items-center gap-x-2">
        <slot name="header">
          <XText v-if="title" size="lg" strong class="shrink-0 whitespace-nowrap">{{ title }}</XText>
        </slot>
        <XText v-if="showTotal" size="sm" type="secondary" class="ml-1 shrink-0 whitespace-nowrap">
          共 <span class="text-primary text-lg font-bold">{{ totalCount }}</span> 条
        </XText>
        <slot name="header-extra" :total="totalCount" />
      </div>
      <div class="flex shrink-0 items-center gap-x-4 text-muted-foreground">
        <!-- 自定义操作区 -->
        <slot name="operator" />
        <!-- 导出按钮（默认导出 xlsx，父组件监听 @export 则交给外部） -->
        <XTooltip v-if="tableExport">
          <template #trigger>
            <XIcon
              name="Download"
              :size="18"
              class="cursor-pointer transition-colors hover:text-foreground"
              @click="handleExportClick"
            />
          </template>
          导出数据
        </XTooltip>
        <!-- 刷新按钮 -->
        <XTooltip v-if="tableRefresh">
          <template #trigger>
            <XIcon
              name="RefreshCw"
              :size="18"
              class="cursor-pointer transition-colors hover:text-foreground"
              @click="emit('refresh')"
            />
          </template>
          刷新数据
        </XTooltip>
        <!-- 列筛选按钮 -->
        <XTooltip v-if="columnFilter">
          <template #trigger>
            <Popover>
              <PopoverTrigger as-child>
                <XIcon
                  name="SlidersHorizontal"
                  :size="18"
                  class="cursor-pointer transition-colors hover:text-foreground"
                />
              </PopoverTrigger>
              <PopoverContent align="end" class="w-48 p-3 z-[100]">
                <div class="mb-2 flex items-center justify-between border-b border-border pb-2">
                  <label class="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <Checkbox
                      :model-value="visibleKeys.size === columns.length"
                      @update:model-value="toggleAll"
                    />
                    全选
                  </label>
                  <XText size="xs" type="secondary">共 {{ columns.length }} 列</XText>
                </div>
                <div class="flex max-h-52 flex-col gap-y-1 overflow-y-auto">
                  <label
                    v-for="col in columns"
                    :key="col.key"
                    class="flex cursor-pointer select-none items-center gap-2 rounded px-1 py-1 text-sm hover:bg-accent"
                  >
                    <Checkbox
                      :model-value="visibleKeys.has(col.key)"
                      :disabled="visibleKeys.size <= 1 && visibleKeys.has(col.key)"
                      @update:model-value="() => toggleColumn(col.key)"
                    />
                    {{ col.title || col.key }}
                  </label>
                </div>
              </PopoverContent>
            </Popover>
          </template>
          数据列筛选
        </XTooltip>
      </div>
    </div>

    <!-- 表格 -->
    <div class="relative min-h-24 overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow class="bg-muted/50 hover:bg-muted/50">
            <TableHead
              v-for="col in filteredColumns"
              :key="col.key"
              :class="cellAlign(col)"
              :style="col.width ? { width: `${col.width}px` } : undefined"
            >
              {{ col.title }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, index) in pageData"
            :key="String(row[rowKey] ?? index)"
            :class="striped && index % 2 === 1 ? 'bg-muted/30' : ''"
            @click="emit('row-click', row, index)"
          >
            <TableCell
              v-for="col in filteredColumns"
              :key="col.key"
              :class="cellAlign(col)"
            >
              <template v-if="col.render">
                <component :is="() => renderCell(col, row, index)" />
              </template>
              <template v-else>
                {{ renderCell(col, row, index) }}
              </template>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- 空数据 -->
      <XEmpty v-if="!loading && pageData.length === 0" :description="emptyText" class="py-10" />
      <!-- 加载中 -->
      <XLoading :loading="loading" mask />
    </div>

    <!-- 分页器 -->
    <div
      v-if="paginationEnabled && totalCount > 0"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <span class="text-sm text-muted-foreground">
        共 {{ totalCount }} 条 · 第 {{ paginationState.page }} / {{ pageCount }} 页
      </span>
      <div class="flex items-center gap-3">
        <Select
          :model-value="String(paginationState.pageSize)"
          @update:model-value="(v: unknown) => handlePageSizeChange(Number(v))"
        >
          <SelectTrigger size="sm" class="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="z-[100]">
            <SelectItem v-for="opt in X_DATA_TABLE_PAGE_SIZE_OPTIONS" :key="opt" :value="String(opt)">
              {{ opt }} 条/页
            </SelectItem>
          </SelectContent>
        </Select>
        <Pagination
          v-model:page="paginationState.page"
          :total="totalCount"
          :items-per-page="paginationState.pageSize"
          :sibling-count="1"
          show-edges
          @update:page="handlePageChange"
        >
          <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
            <PaginationPrevious />
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === paginationState.page"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis v-else :index="index" />
            </template>
            <PaginationNext />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>

import type { VNode } from 'vue'

/** XDataTable 列定义 */
export interface XDataTableColumn {
  /** 列标识（对应行数据的 key） */
  key: string
  /** 列标题 */
  title: string
  /** 列宽度（px） */
  width?: number
  /** 是否左对齐（默认左对齐） */
  align?: 'left' | 'center' | 'right'
  /** 自定义单元格渲染；返回 VNode 或字符串 */
  render?: (row: Record<string, any>, index: number) => VNode | string
}

/** XDataTable 分页状态 */
export interface XDataTablePagination {
  /** 当前页（从 1 开始） */
  page: number
  /** 每页条数 */
  pageSize: number
}

/** XDataTable 默认每页条数选项 */
export const X_DATA_TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50]
/** XDataTable 默认每页条数 */
export const X_DATA_TABLE_DEFAULT_PAGE_SIZE = 10

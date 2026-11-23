/** XDetail 单个字段类型 */
export interface XDetailField {
  /** 字段标签；传空字符串时不渲染标签 */
  label: string
  /** 取值键名（对应 data 中的 key），也作为 slot 类型插槽名 `slot-{key}` */
  key: string
  /** 展示类型：text 文本 / slot 插槽 / image 图片 */
  type?: 'text' | 'slot' | 'image'
  /** 占据的列跨度（一行按 X_DETAIL_DEFAULT_COLUMNS 等分）；显式声明覆盖 column 推算 */
  span?: number
  /** 空值占位文案 */
  placeholder?: string
  /** 文本字段格式化展示（仅影响回显，不修改原始数据） */
  formatter?: (value: any, data: Record<string, any>) => any
}

/** XDetail 默认每行列数 */
export const X_DETAIL_DEFAULT_COLUMNS = 4

/** XDetail 默认空值占位 */
export const X_DETAIL_DEFAULT_PLACEHOLDER = '-'

/** XDetail 图片字段默认占的列跨度（占满一行） */
export const X_DETAIL_IMAGE_SPAN = 4

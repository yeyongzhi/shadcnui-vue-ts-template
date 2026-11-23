/** XSelect 选项类型 */
export interface XSelectOption {
  /** 选项值 */
  value: string | number
  /** 选项文案 */
  label: string
  /** 是否禁用 */
  disabled?: boolean
}

/** XSelect 默认占位文案 */
export const X_SELECT_DEFAULT_PLACEHOLDER = '请选择'

import type { Component, VNode } from 'vue'
import type { XSelectOption } from '@/components/x/XSelect'

/** XForm 表单项类型 */
export type XFormFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkbox-group'
  | 'switch'
  | 'date'
  | 'date-range'
  | 'number'
  | 'custom'

/** XForm 表单项配置 */
export interface XFormField {
  /** 字段键名（对应 model 中的 key） */
  key: string
  /** 标签文案 */
  label: string
  /** 表单项类型 */
  type?: XFormFieldType
  /** 占位文案（缺省按类型给默认值） */
  placeholder?: string
  /** 单个 checkbox 控件的说明文案 */
  checkboxLabel?: string
  /** 是否必填（提交时校验，失败 toast 提示） */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 日期、日期范围是否精确到时分秒 */
  showTime?: boolean
  /** select / radio / checkbox-group 类型的选项列表 */
  options?: XSelectOption[]
  /** radio / checkbox-group 的排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** checkbox-group 是否在顶部显示「全选」复选框，默认显示 */
  checkAll?: boolean
  /** select 是否可清空 */
  clearable?: boolean
  /** textarea 行数 */
  rows?: number
  /** number 精度（小数位） */
  precision?: number
  /** number 最小值 */
  min?: number
  /** number 最大值 */
  max?: number
  /** 自定义渲染（type: 'custom' 时使用） */
  render?: (model: Record<string, any>) => VNode | Component | string
}

/** XForm 默认标签宽度（px） */
export const X_FORM_DEFAULT_LABEL_WIDTH = 90

/** 各类型默认占位文案 */
export const X_FORM_PLACEHOLDER_MAP: Record<XFormFieldType, string> = {
  input: '请输入',
  textarea: '请输入',
  select: '请选择',
  date: '请选择日期',
  'date-range': '请选择日期范围',
  number: '请输入',
  password: '请输入',
  radio: '',
  checkbox: '',
  'checkbox-group': '',
  switch: '',
  custom: '',
}

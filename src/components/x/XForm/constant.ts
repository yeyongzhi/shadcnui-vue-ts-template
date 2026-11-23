import type { Component, VNode } from 'vue'
import type { XSelectOption } from '@/components/x/XSelect'

/** XForm 表单项类型 */
export type XFormFieldType = 'input' | 'textarea' | 'select' | 'date' | 'number' | 'custom'

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
  /** 是否必填（提交时校验，失败 toast 提示） */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** select 类型的选项列表 */
  options?: XSelectOption[]
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
  number: '请输入',
  custom: '',
}

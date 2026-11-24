/**
 * XCheckboxGroup size map.
 * Use complete Tailwind class names so they can be collected at build time.
 */
export const X_CHECKBOX_GROUP_SIZE_MAP = {
  small: { box: 'size-3.5', icon: 12, label: 'text-xs' },
  medium: { box: 'size-4', icon: 14, label: 'text-sm' },
  large: { box: 'size-5', icon: 16, label: 'text-base' },
} as const

export type XCheckboxGroupSize = keyof typeof X_CHECKBOX_GROUP_SIZE_MAP

export interface XCheckboxGroupOption {
  value: string | number
  label?: string
  disabled?: boolean
}
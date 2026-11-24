/**
 * XRadioGroup size map.
 * Use complete Tailwind class names so they can be collected at build time.
 */
export const X_RADIO_GROUP_SIZE_MAP = {
  small: { dot: 'size-3.5', dotInner: 'size-1', label: 'text-xs' },
  medium: { dot: 'size-4', dotInner: 'size-1.5', label: 'text-sm' },
  large: { dot: 'size-5', dotInner: 'size-2', label: 'text-base' },
} as const

export type XRadioGroupSize = keyof typeof X_RADIO_GROUP_SIZE_MAP

export interface XRadioGroupOption {
  value: string | number
  label?: string
  disabled?: boolean
}
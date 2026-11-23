/**
 * XRadioBox size map.
 * Use complete Tailwind class names so they can be collected at build time.
 */
export const X_RADIO_BOX_SIZE_MAP = {
  small: { item: 'px-3 py-1 text-xs' },
  medium: { item: 'px-4 py-1.5 text-sm' },
  large: { item: 'px-5 py-2 text-base' },
} as const

export type XRadioBoxSize = keyof typeof X_RADIO_BOX_SIZE_MAP

/** 未选中项样式 */
export const X_RADIO_BOX_INACTIVE_CLASS
  = 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'

export interface XRadioBoxOption {
  value: string | number
  label?: string
  disabled?: boolean
}

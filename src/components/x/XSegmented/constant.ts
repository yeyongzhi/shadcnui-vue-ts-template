/**
 * XSegmented size map.
 * Use complete Tailwind class names so they can be collected at build time.
 */
export const X_SEGMENTED_SIZE_MAP = {
  small: { track: 'p-0.5', item: 'px-3 py-1 text-xs', iconSize: 14 },
  medium: { track: 'p-1', item: 'px-4 py-1.5 text-sm', iconSize: 16 },
  large: { track: 'p-1', item: 'px-5 py-2 text-base', iconSize: 18 },
} as const

export type XSegmentedSize = keyof typeof X_SEGMENTED_SIZE_MAP

export interface XSegmentedOption {
  value: string | number | null
  label?: string
  icon?: string
  disabled?: boolean
}

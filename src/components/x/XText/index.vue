<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { X_TEXT_DEFAULT_SIZE } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  size: {
    type: String as PropType<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>,
    default: X_TEXT_DEFAULT_SIZE,
  },
  /** 语义类型，决定文字颜色；default 跟随正文色 */
  type: {
    type: String as PropType<'default' | 'secondary' | 'success' | 'warning' | 'error'>,
    default: 'default',
  },
  /** 是否加粗 */
  strong: {
    type: Boolean,
    default: false,
  },
  /** 是否删除线 */
  del: {
    type: Boolean,
    default: false,
  },
})

// 完整类名，保证 Tailwind 扫描时不被裁剪
const sizeMap = {
  'xs':   'text-xs',
  'sm':   'text-sm',
  'base': 'text-base',
  'lg':   'text-lg',
  'xl':   'text-xl',
  '2xl':  'text-2xl',
  '3xl':  'text-3xl',
  '4xl':  'text-4xl',
}

const sizeClass = computed(() => sizeMap[props.size])

const typeMap = {
  'default':   'text-foreground',
  'secondary': 'text-muted-foreground',
  'success':   'text-[var(--success, oklch(0.72 0.17 155))]',
  'warning':   'text-[var(--warning, oklch(0.77 0.16 70))]',
  'error':     'text-destructive',
}
const typeClass = computed(() => typeMap[props.type])
</script>

<template>
  <span
    class="x-text inline"
    :class="[sizeClass, typeClass, strong ? 'font-bold' : '', del ? 'line-through opacity-70' : '']"
    v-bind="$attrs"
  >
    <slot />
  </span>
</template>

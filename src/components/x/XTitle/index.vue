<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import XIcon from '@/components/x/XIcon'
import XTooltip from '@/components/x/XTooltip'
import { X_TITLE_DEFAULT_SIZE } from './constant'

const props = defineProps({
  // 字号，取值同 tailwindcss（xs / sm / base / lg ...）
  size: {
    type: String as PropType<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>,
    default: X_TITLE_DEFAULT_SIZE,
  },
  // 是否在标题前显示一根竖条装饰，颜色跟随 type
  prefix: {
    type: Boolean,
    default: false,
  },
  // 语义类型，决定标题文字与竖条颜色
  type: {
    type: String as PropType<'default' | 'success' | 'warning' | 'error'>,
    default: 'default',
  },
})

const slots = useSlots()
const hasTooltip = computed(() => !!slots.tooltip)

// 完整类名映射，保证 Tailwind 扫描时不被裁剪（不可用 `text-${size}` 动态拼接）
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

// 竖条颜色：default 用主题主色，其余用对应语义色变量
const barColorMap = {
  'default': 'var(--primary)',
  'success': 'var(--success, oklch(0.72 0.17 155))',
  'warning': 'var(--warning, oklch(0.77 0.16 70))',
  'error':   'var(--destructive)',
}
const barColor = computed(() => barColorMap[props.type] ?? 'var(--primary)')
</script>

<template>
  <!-- 字号挂在根节点，竖条（h-[1em]）与文字都按当前字号缩放 -->
  <div class="x-title flex items-center font-bold" :class="sizeClass">
    <!-- 左侧竖条装饰：高度随字号、颜色随 type -->
    <span
      v-if="prefix"
      class="x-title-bar inline-block w-1 h-[1em] rounded mr-2 shrink-0"
      :style="{ backgroundColor: barColor }"
    />
    <span class="text-foreground"><slot /></span>
    <XTooltip v-if="hasTooltip">
      <template #trigger>
        <XIcon name="CircleQuestionMark" :size="14" class="ml-1 cursor-help opacity-50" />
      </template>
      <slot name="tooltip" />
    </XTooltip>
    <!-- 右侧操作区：靠右对齐，重置字重避免继承标题加粗 -->
    <div v-if="$slots.extra" class="x-title-extra ml-auto font-normal">
      <slot name="extra" />
    </div>
  </div>
</template>

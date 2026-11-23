<script setup lang="ts">
import type { Component } from 'vue'
import { computed, type PropType } from 'vue'
import * as icons from '@lucide/vue'
import { X_ICON_DEFAULT_SIZE } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** lucide 图标名称（PascalCase，如 'Search'） */
  name: {
    type: String,
    default: '',
  },
  /** 图标尺寸（px） */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: X_ICON_DEFAULT_SIZE,
  },
  /** 图标颜色，默认跟随文字颜色 */
  color: {
    type: String,
    default: 'currentColor',
  },
  /** 线条粗细 */
  strokeWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 2,
  },
  /** 自定义图标组件，传入后优先于 name */
  component: {
    type: [Object, Function] as PropType<Component>,
    default: undefined,
  },
})

const iconComponent = computed<Component | undefined>(() => {
  if (props.component) return props.component
  if (!props.name) return undefined
  return (icons as unknown as Record<string, Component>)[props.name]
})
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :size="typeof size === 'number' ? size : Number(size)"
    :color="color"
    :stroke-width="typeof strokeWidth === 'number' ? strokeWidth : Number(strokeWidth)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import XText from '@/components/x/XText'
import { X_LOADING_DEFAULT_SIZE, X_LOADING_DEFAULT_TEXT } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 是否处于加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** spinner 尺寸（px） */
  size: {
    type: Number,
    default: X_LOADING_DEFAULT_SIZE,
  },
  /** 加载提示文字，传空字符串则不显示 */
  text: {
    type: String,
    default: X_LOADING_DEFAULT_TEXT,
  },
  /** 文字语义色 */
  textType: {
    type: String as PropType<'default' | 'secondary'>,
    default: 'secondary',
  },
  /** 是否显示遮罩（包裹模式：遮罩盖住父容器内容） */
  mask: {
    type: Boolean,
    default: false,
  },
  /** spinner 颜色 */
  color: {
    type: String,
    default: 'var(--primary)',
  },
})

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderWidth: `${Math.max(2, Math.round(props.size / 12))}px`,
  borderColor: 'color-mix(in oklab, currentColor 20%, transparent)',
  borderTopColor: props.color,
}))
</script>

<template>
  <!-- 包裹模式：绝对定位遮罩，需父容器 position: relative -->
  <div
    v-if="loading && mask"
    class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-background/60"
    role="status"
    aria-live="polite"
  >
    <span class="inline-block animate-spin rounded-full" :style="spinnerStyle" />
    <XText v-if="text" :type="textType">{{ text }}</XText>
    <span class="sr-only">{{ text }}</span>
  </div>
  <!-- 独立模式：直接渲染 loader -->
  <div
    v-else-if="loading"
    class="flex flex-col items-center justify-center gap-2 py-4"
    role="status"
    aria-live="polite"
    v-bind="$attrs"
  >
    <span class="inline-block animate-spin rounded-full" :style="spinnerStyle" />
    <XText v-if="text" :type="textType">{{ text }}</XText>
    <span class="sr-only">{{ text }}</span>
  </div>
</template>

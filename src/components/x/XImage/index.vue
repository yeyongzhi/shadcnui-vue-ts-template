<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import XImagePreviewDialog from '@/components/x/XImagePreviewDialog'
import {
  X_IMAGE_DEFAULT_HEIGHT,
  X_IMAGE_DEFAULT_RADIUS,
  X_IMAGE_DEFAULT_WIDTH,
} from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 图片地址 */
  src: {
    type: String,
    required: true,
  },
  /** 替代文本 */
  alt: {
    type: String,
    default: '',
  },
  /** 宽度（px），0 表示 100% */
  width: {
    type: Number,
    default: X_IMAGE_DEFAULT_WIDTH,
  },
  /** 高度（px），0 表示按宽度等比 */
  height: {
    type: Number,
    default: X_IMAGE_DEFAULT_HEIGHT,
  },
  /** 圆角（px） */
  radius: {
    type: Number,
    default: X_IMAGE_DEFAULT_RADIUS,
  },
  /** 填充模式，同 CSS object-fit */
  fit: {
    type: String as PropType<'cover' | 'contain' | 'fill' | 'none' | 'scale-down'>,
    default: 'cover',
  },
  /** 点击是否打开大图预览 */
  preview: {
    type: Boolean,
    default: true,
  },
  /** 加载失败占位文字 */
  errorText: {
    type: String,
    default: '加载失败',
  },
})

const isError = ref(false)
const previewOpen = ref(false)

const sizeStyle = computed(() => ({
  width: props.width === 0 ? '100%' : `${props.width}px`,
  height: props.height === 0 ? 'auto' : `${props.height}px`,
  borderRadius: `${props.radius}px`,
  objectFit: props.fit,
}))

const handleError = () => {
  isError.value = true
}

const handleClick = () => {
  if (props.preview && !isError.value) previewOpen.value = true
}
</script>

<template>
  <div class="x-image inline-flex select-none">
    <!-- 加载失败占位 -->
    <div
      v-if="isError"
      class="flex items-center justify-center bg-muted text-muted-foreground text-xs"
      :style="sizeStyle"
    >
      {{ errorText }}
    </div>
    <img
      v-else
      :src="src"
      :alt="alt"
      class="cursor-zoom-in"
      :style="sizeStyle"
      v-bind="$attrs"
      @error="handleError"
      @click="handleClick"
    >
    <!-- 大图预览 -->
    <XImagePreviewDialog v-model:open="previewOpen" :images="[src]" />
  </div>
</template>

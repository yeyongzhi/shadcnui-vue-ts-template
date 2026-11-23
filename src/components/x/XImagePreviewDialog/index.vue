<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { Button } from '@/components/ui/button'
import XDialog from '@/components/x/XDialog'
import XIcon from '@/components/x/XIcon'
import {
  X_IMAGE_PREVIEW_DEFAULT_SCALE,
  X_IMAGE_PREVIEW_MAX_SCALE,
  X_IMAGE_PREVIEW_MIN_SCALE,
  X_IMAGE_PREVIEW_SCALE_STEP,
} from './constant'

const props = defineProps({
  /** 是否打开，支持 v-model:open */
  open: {
    type: Boolean,
    default: false,
  },
  /** 图片地址列表 */
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** 初始显示的图片下标 */
  initialIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const currentIndex = ref(props.initialIndex)
const scale = ref(X_IMAGE_PREVIEW_DEFAULT_SCALE)

watch(() => props.open, (open) => {
  if (open) {
    currentIndex.value = Math.min(Math.max(props.initialIndex, 0), Math.max(props.images.length - 1, 0))
    scale.value = X_IMAGE_PREVIEW_DEFAULT_SCALE
  }
})

const currentImage = computed(() => props.images[currentIndex.value] ?? '')
const hasMultiple = computed(() => props.images.length > 1)

const resetTransform = () => {
  scale.value = X_IMAGE_PREVIEW_DEFAULT_SCALE
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
    resetTransform()
  }
}

const next = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value += 1
    resetTransform()
  }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value + X_IMAGE_PREVIEW_SCALE_STEP, X_IMAGE_PREVIEW_MAX_SCALE)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - X_IMAGE_PREVIEW_SCALE_STEP, X_IMAGE_PREVIEW_MIN_SCALE)
}

const handleClose = (open: boolean) => {
  emit('update:open', open)
}
</script>

<template>
  <XDialog
    :open="open"
    title="图片预览"
    :confirm-text="''"
    :cancel-text="''"
    :width="880"
    content-class="px-4 pb-4"
    class="[&>div[data-slot=dialog-content]]:overflow-hidden"
    @update:open="handleClose"
  >
    <!-- 图片舞台：圆角画布 + 深色衬底，四周有呼吸边距 -->
    <div
      class="relative flex items-center justify-center rounded-lg bg-foreground/90 overflow-hidden select-none"
      :style="{ minHeight: hasMultiple ? '320px' : '260px' }"
    >
      <img
        :key="currentImage"
        :src="currentImage"
        class="block max-h-[62vh] max-w-full w-auto object-contain p-2 transition-transform duration-150"
        :style="{ transform: `scale(${scale})` }"
        alt="预览图片"
      >

      <!-- 多图切换 -->
      <template v-if="hasMultiple">
        <Button
          variant="ghost"
          size="icon"
          class="absolute left-3 size-9 rounded-full bg-background/85 shadow-sm hover:bg-background"
          :disabled="currentIndex === 0"
          @click="prev"
        >
          <XIcon name="ChevronLeft" :size="20" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          class="absolute right-3 size-9 rounded-full bg-background/85 shadow-sm hover:bg-background"
          :disabled="currentIndex === images.length - 1"
          @click="next"
        >
          <XIcon name="ChevronRight" :size="20" />
        </Button>
        <span class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-xs text-foreground shadow-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </span>
      </template>

      <!-- 缩放工具条 -->
      <div class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 p-1 shadow-sm">
        <Button variant="ghost" size="icon-sm" class="rounded-full" @click="zoomOut">
          <XIcon name="ZoomOut" :size="16" />
        </Button>
        <span class="min-w-10 text-center text-xs text-muted-foreground">{{ Math.round(scale * 100) }}%</span>
        <Button variant="ghost" size="icon-sm" class="rounded-full" @click="zoomIn">
          <XIcon name="ZoomIn" :size="16" />
        </Button>
        <Button variant="ghost" size="icon-sm" class="rounded-full" @click="resetTransform">
          <XIcon name="RotateCcw" :size="16" />
        </Button>
      </div>
    </div>

    <!-- 缩略图条（多图时）：与舞台间距呼吸 -->
    <div
      v-if="hasMultiple"
      class="mt-3 flex items-center gap-2 overflow-x-auto pb-1"
    >
      <button
        v-for="(src, i) in images"
        :key="src"
        type="button"
        class="size-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors cursor-pointer"
        :class="i === currentIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'"
        @click="currentIndex = i; resetTransform()"
      >
        <img :src="src" class="size-full object-cover" :alt="`缩略图 ${i + 1}`">
      </button>
    </div>
  </XDialog>
</template>

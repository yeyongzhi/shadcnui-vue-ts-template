<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type PropType } from 'vue'
import XIcon from '@/components/x/XIcon'
import toast from '@/plugins/message'
import {
  X_COPY_TEXT_DEFAULT_FEEDBACK_DURATION,
  X_COPY_TEXT_DEFAULT_ICON,
  X_COPY_TEXT_DEFAULT_SUCCESS_ICON,
  X_COPY_TEXT_SIZE_TO_ICON_SIZE,
} from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 要复制的文本内容 */
  text: {
    type: String,
    required: true,
  },
  /** 显示的文本（不传则显示 text 本身） */
  showText: {
    type: String,
    default: undefined,
  },
  /** 复制按钮图标（lucide 图标名称） */
  icon: {
    type: String,
    default: X_COPY_TEXT_DEFAULT_ICON,
  },
  /** 复制成功后的反馈图标（lucide 图标名称） */
  successIcon: {
    type: String,
    default: X_COPY_TEXT_DEFAULT_SUCCESS_ICON,
  },
  /** 文字尺寸（xs ~ 4xl），图标大小自动匹配 */
  size: {
    type: String as PropType<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>,
    default: 'base',
  },
  /** 成功图标显示时长（毫秒） */
  feedbackDuration: {
    type: Number,
    default: X_COPY_TEXT_DEFAULT_FEEDBACK_DURATION,
  },
  /** 是否显示消息提示 */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /** 复制成功的提示文案 */
  successMessage: {
    type: String,
    default: '复制成功',
  },
  /** 复制失败的提示文案 */
  errorMessage: {
    type: String,
    default: '复制失败',
  },
})

const emit = defineEmits<{
  /** 复制成功时触发 */
  (e: 'copy-success', text: string): void
  /** 复制失败时触发 */
  (e: 'copy-error', error: Error): void
}>()

// 实际显示的文字
const displayText = computed(() => props.showText ?? props.text)

// 图标尺寸：根据文字尺寸自动匹配
const iconSize = computed(() => X_COPY_TEXT_SIZE_TO_ICON_SIZE[props.size] ?? X_COPY_TEXT_SIZE_TO_ICON_SIZE.base)

// 反馈状态：true 时显示成功图标
const isCopied = ref(false)
let feedbackTimer: ReturnType<typeof setTimeout> | null = null
onBeforeUnmount(() => { if (feedbackTimer) clearTimeout(feedbackTimer) })

/**
 * 写入剪贴板。
 * 优先使用现代 Clipboard API，不支持时回退到 execCommand（兼容旧浏览器 / HTTP 环境）。
 */
const writeToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    const ok = document.execCommand('copy')
    if (!ok) throw new Error('execCommand copy failed')
  }
  finally {
    document.body.removeChild(textarea)
  }
}

const handleCopy = async () => {
  try {
    await writeToClipboard(props.text)
    isCopied.value = true
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      isCopied.value = false
    }, props.feedbackDuration)
    if (props.showMessage) toast.success(props.successMessage)
    emit('copy-success', props.text)
  }
  catch (error) {
    if (props.showMessage) toast.error(props.errorMessage)
    emit('copy-error', error instanceof Error ? error : new Error(String(error)))
  }
}
</script>

<template>
  <span
    class="x-copy-text inline-flex max-w-full items-center gap-1"
    v-bind="$attrs"
  >
    <span class="truncate">{{ displayText }}</span>
    <button
      type="button"
      class="x-copy-text-btn inline-flex cursor-pointer items-center p-0.5 text-muted-foreground opacity-60 transition-opacity hover:opacity-100"
      :title="displayText"
      @click.stop="handleCopy"
    >
      <XIcon :name="isCopied ? successIcon : icon" :size="iconSize" :class="isCopied ? 'text-success' : ''" />
    </button>
  </span>
</template>

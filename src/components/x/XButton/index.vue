<script setup lang="ts">
import { computed } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import type { ButtonVariants } from '@/components/ui/button'
import XIcon from '@/components/x/XIcon'
import { X_BUTTON_DEFAULT_ICON_SIZE } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** 按钮变体，同 shadcn Button */
  variant?: ButtonVariants['variant']
  /** 按钮尺寸，同 shadcn Button */
  size?: ButtonVariants['size']
  /** lucide 图标名称（渲染在文字前） */
  icon?: string
  /** 加载状态：显示旋转图标并禁用点击 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
}>()

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <Button
    :variant="variant"
    :size="size"
    :disabled="isDisabled"
    v-bind="$attrs"
  >
    <LoaderCircle v-if="loading" class="animate-spin" :size="X_BUTTON_DEFAULT_ICON_SIZE" />
    <XIcon v-else-if="icon" :name="icon" :size="X_BUTTON_DEFAULT_ICON_SIZE" />
    <slot />
  </Button>
</template>

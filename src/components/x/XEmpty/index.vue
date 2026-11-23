<script setup lang="ts">
import XIcon from '@/components/x/XIcon'
import XText from '@/components/x/XText'
import { X_EMPTY_DEFAULT_DESCRIPTION } from './constant'

interface Props {
  /** 空状态描述文字 */
  description?: string
  /** 是否显示描述文字 */
  showDescription?: boolean
  /** 是否显示图标 */
  showIcon?: boolean
}

withDefaults(defineProps<Props>(), {
  description: X_EMPTY_DEFAULT_DESCRIPTION,
  showDescription: true,
  showIcon: true,
})

defineSlots<{
  extra?: () => any
  icon?: () => any
}>()
</script>

<template>
  <div role="status" class="flex min-h-28 w-full flex-col items-center justify-center gap-y-3 py-6 text-center">
    <div v-if="showIcon" class="flex items-center justify-center text-muted-foreground">
      <slot name="icon">
        <XIcon name="Inbox" :size="48" />
      </slot>
    </div>
    <XText v-if="showDescription" type="secondary">{{ description }}</XText>
    <div v-if="$slots.extra" class="flex items-center justify-center gap-x-2">
      <slot name="extra" />
    </div>
  </div>
</template>

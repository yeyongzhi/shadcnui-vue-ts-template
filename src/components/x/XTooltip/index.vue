<script setup lang="ts">
import type { PropType } from 'vue'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { X_TOOLTIP_DEFAULT_SIDE } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 弹出位置 */
  side: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    default: X_TOOLTIP_DEFAULT_SIDE,
  },
  /** 是否禁用（禁用后不弹出） */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 延迟弹出时长（毫秒） */
  delayDuration: {
    type: Number,
    default: 300,
  },
})
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <Tooltip>
      <TooltipTrigger as-child :disabled="disabled">
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipContent :side="side" v-bind="$attrs" class="z-[100]">
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

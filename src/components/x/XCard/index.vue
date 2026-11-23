<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import XTitle from '@/components/x/XTitle'
import { X_CARD_DEFAULT_PADDING } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 卡片标题；不传且无 default 插槽时不渲染头部 */
  title: {
    type: String,
    default: '',
  },
  /** 卡片副标题 */
  subtitle: {
    type: String,
    default: '',
  },
  /** 标题字号，同 XTitle 的 size */
  titleSize: {
    type: String as PropType<'xs' | 'sm' | 'base' | 'lg' | 'xl'>,
    default: 'base',
  },
  /** 标题前竖条装饰 */
  titlePrefix: {
    type: Boolean,
    default: false,
  },
  /** 内边距模式：default 常规 / compact 紧凑 / none 自行控制 */
  padding: {
    type: String as PropType<'default' | 'compact' | 'none'>,
    default: X_CARD_DEFAULT_PADDING,
  },
})

const slots = useSlots()

// shadcn Card 底座自带 py-6；header/content 只补左右和底部内边距，避免上下叠加双倍间距
const hasHeader = computed(() => !!props.title || !!props.subtitle || !!slots.extra || !!slots.title)
const headerClass = computed(() =>
  props.padding === 'compact' ? 'px-4 pt-0' : 'px-6 pt-0',
)
const contentClass = computed(() => ({
  'default': 'px-6 pb-0',
  'compact': 'px-4 pb-0',
  'none': '',
}[props.padding]))
const footerClass = computed(() => (props.padding === 'compact' ? 'px-4 pb-0' : 'px-6 pb-0'))
</script>

<template>
  <Card v-bind="$attrs" class="gap-0">
    <CardHeader v-if="hasHeader" :class="headerClass">
      <template v-if="$slots.title">
        <slot name="title" />
      </template>
      <XTitle v-else-if="title" :size="titleSize" :prefix="titlePrefix">
        {{ title }}
        <template v-if="$slots.extra" #extra>
          <slot name="extra" />
        </template>
      </XTitle>
      <CardDescription v-if="subtitle">{{ subtitle }}</CardDescription>
      <!-- 无标题但有 extra 时，extra 单独渲染在右上角 -->
      <CardAction v-if="!title && $slots.extra">
        <slot name="extra" />
      </CardAction>
    </CardHeader>
    <CardContent :class="contentClass">
      <slot />
    </CardContent>
    <CardFooter v-if="$slots.footer" :class="footerClass">
      <slot name="footer" />
    </CardFooter>
  </Card>
</template>

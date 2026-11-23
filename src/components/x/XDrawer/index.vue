<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import XButton from '@/components/x/XButton'
import XLoading from '@/components/x/XLoading'
import {
  X_DRAWER_DEFAULT_CANCEL_TEXT,
  X_DRAWER_DEFAULT_CONFIRM_TEXT,
  X_DRAWER_DEFAULT_WIDTH,
} from './constant'

const props = defineProps({
  /** 是否打开，支持 v-model:open */
  open: {
    type: Boolean,
    default: false,
  },
  /** 弹出方向 */
  side: {
    type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
    default: 'right',
  },
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 描述文字 */
  description: {
    type: String,
    default: '',
  },
  /** 抽屉尺寸：左右方向为宽度，上下方向为高度（px） */
  size: {
    type: Number,
    default: X_DRAWER_DEFAULT_WIDTH,
  },
  /** 确认按钮文案；传空字符串则不渲染确认按钮 */
  confirmText: {
    type: String,
    default: X_DRAWER_DEFAULT_CONFIRM_TEXT,
  },
  /** 取消按钮文案；传空字符串则不渲染取消按钮 */
  cancelText: {
    type: String,
    default: X_DRAWER_DEFAULT_CANCEL_TEXT,
  },
  /** 确认中状态：确认按钮转圈且不可点 */
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  /** 内容加载状态：内容区显示 loading */
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  confirm: []
  cancel: []
}>()

const slots = useSlots()
const hasFooter = computed(() =>
  !!slots.footer
  || (props.confirmText !== '' || props.cancelText !== ''),
)

const isVertical = computed(() => props.side === 'top' || props.side === 'bottom')

const sizeStyle = computed(() => isVertical.value
  ? { height: `${props.size}px` }
  : { width: `${props.size}px` })

const handleClose = (open: boolean) => {
  if (!open && props.confirmLoading) return
  emit('update:open', open)
  if (!open) emit('cancel')
}

const handleConfirm = () => {
  if (props.confirmLoading) return
  emit('confirm')
}

const handleCancel = () => {
  emit('update:open', false)
  emit('cancel')
}
</script>

<template>
  <Sheet :open="open" @update:open="handleClose">
    <!-- 抽屉容器：flex 布局由本组件接管，shadcn 默认 gap-4 收紧为受控间距 -->
    <SheetContent :side="side" :style="sizeStyle" class="flex flex-col gap-0 p-0">
      <SheetHeader class="border-b border-border">
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription v-if="description">{{ description }}</SheetDescription>
      </SheetHeader>

      <!-- 内容区：左右统一内边距，避免内容贴边 / 长文字被挤成竖排 -->
      <div class="relative min-h-0 flex-1 p-4">
        <div class="h-full overflow-y-auto">
          <slot />
        </div>
        <XLoading :loading="loading" mask text="加载中…" />
      </div>

      <!-- 底部操作区：按钮一行靠右展示，与 XDialog 结构一致 -->
      <SheetFooter
        v-if="hasFooter"
        class="flex-row justify-end gap-2 border-t border-border bg-background p-4"
      >
        <slot name="footer">
          <Button v-if="cancelText" variant="outline" :disabled="confirmLoading" @click="handleCancel">
            {{ cancelText }}
          </Button>
          <XButton :loading="confirmLoading" @click="handleConfirm">
            {{ confirmText }}
          </XButton>
        </slot>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

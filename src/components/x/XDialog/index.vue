<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import XButton from '@/components/x/XButton'
import XLoading from '@/components/x/XLoading'
import {
  X_DIALOG_DEFAULT_CANCEL_TEXT,
  X_DIALOG_DEFAULT_CONFIRM_TEXT,
} from './constant'

const props = defineProps({
  /** 是否打开，支持 v-model:open */
  open: {
    type: Boolean,
    default: false,
  },
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 描述文字（标题下方的说明） */
  description: {
    type: String,
    default: '',
  },
  /** 弹窗宽度（px） */
  width: {
    type: Number,
    default: 480,
  },
  /** 内容区附加类（如 p-0 去内边距，供图片预览等自定义内容使用） */
  contentClass: {
    type: String,
    default: '',
  },
  /** 确认按钮文案；传空字符串则不渲染确认按钮 */
  confirmText: {
    type: String,
    default: X_DIALOG_DEFAULT_CONFIRM_TEXT,
  },
  /** 取消按钮文案；传空字符串则不渲染取消按钮 */
  cancelText: {
    type: String,
    default: X_DIALOG_DEFAULT_CANCEL_TEXT,
  },
  /** 确认按钮变体 */
  confirmVariant: {
    type: String as PropType<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>,
    default: 'default',
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

const handleClose = (open: boolean) => {
  if (!open && props.confirmLoading) return // 确认中不允许关闭
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
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent
      :style="{ maxWidth: `${width}px` }"
      class="gap-4"
      :class="contentClass"
    >
      <DialogHeader v-if="title || description">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{ description }}</DialogDescription>
      </DialogHeader>

      <!-- 内容区：loading 时显示加载态 -->
      <div class="relative">
        <div class="max-h-[70vh] overflow-y-auto">
          <slot />
        </div>
        <XLoading :loading="loading" mask text="加载中…" />
      </div>

      <DialogFooter v-if="hasFooter">
        <slot name="footer">
          <Button v-if="cancelText" variant="outline" :disabled="confirmLoading" @click="handleCancel">
            {{ cancelText }}
          </Button>
          <XButton
            v-if="confirmText"
            :variant="confirmVariant"
            :loading="confirmLoading"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </XButton>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

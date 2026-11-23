<script setup lang="ts">
import { computed, type PropType } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X_SELECT_DEFAULT_PLACEHOLDER, type XSelectOption } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 当前选中值，支持 v-model */
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: undefined,
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<XSelectOption[]>,
    default: () => [],
  },
  /** 占位文案 */
  placeholder: {
    type: String,
    default: X_SELECT_DEFAULT_PLACEHOLDER,
  },
  /** 是否可清空（选中后 hover 显示清空按钮） */
  clearable: {
    type: Boolean,
    default: true,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 触发器尺寸 */
  size: {
    type: String as PropType<'sm' | 'default'>,
    default: 'default',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null]
}>()

// 归一化：把任意传入 options（补 label）统一成 XSelectOption[]
const normalizedOptions = computed<XSelectOption[]>(() =>
  props.options.map(opt => ({
    ...opt,
    label: opt.label ?? String(opt.value),
  })),
)

// 显示文案：找不到选项时直接显示值本身
const selectedLabel = computed(() => {
  const opt = normalizedOptions.value.find(o => o.value === props.modelValue)
  return opt ? opt.label : (props.modelValue ?? '')
})

const handleUpdate = (value: unknown) => {
  // reka-ui SelectItem 的 value 是 string；数字值做一次还原
  const matched = normalizedOptions.value.find(o => String(o.value) === String(value))
  const next = matched ? matched.value : (typeof value === 'string' ? value : null)
  emit('update:modelValue', next)
  emit('change', next)
}

const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<template>
  <div
    class="x-select group relative inline-flex w-full"
    :class="{ 'pointer-events-none opacity-50': disabled }"
  >
    <Select
      :model-value="modelValue === null || modelValue === undefined ? undefined : String(modelValue)"
      :disabled="disabled"
      @update:model-value="handleUpdate"
    >
      <SelectTrigger class="w-full" :size="size" v-bind="{ ...$attrs, class: undefined }">
        <SelectValue :placeholder="placeholder">
          {{ selectedLabel }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="max-h-72 z-[100]">
        <SelectItem
          v-for="opt in normalizedOptions"
          :key="String(opt.value)"
          :value="String(opt.value)"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <!-- 清空按钮：选中且可清空时，悬浮显示在触发器右侧 -->
    <button
      v-if="clearable && modelValue !== null && modelValue !== undefined"
      type="button"
      class="absolute right-7 top-1/2 z-10 hidden size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-muted-foreground/40 text-background group-hover:inline-flex"
      aria-label="清空"
      @click.stop="handleClear"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="size-2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  </div>
</template>

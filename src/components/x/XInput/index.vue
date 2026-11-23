<script setup lang="ts">
import { computed, ref, useAttrs, watch, type PropType } from 'vue'
import { Input } from '@/components/ui/input'
import XIcon from '@/components/x/XIcon'
import { X_INPUT_DEFAULT_CLEARABLE } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 输入值，支持 v-model */
  modelValue: {
    type: [String, Number] as PropType<string | number | null>,
    default: '',
  },
  /** 占位文字 */
  placeholder: {
    type: String,
    default: '请输入',
  },
  /** 是否可清空（有值时显示清空按钮） */
  clearable: {
    type: Boolean,
    default: X_INPUT_DEFAULT_CLEARABLE,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  enter: [value: string]
  clear: []
}>()

const innerValue = ref(String(props.modelValue ?? ''))
watch(() => props.modelValue, (v) => {
  if (v !== innerValue.value) innerValue.value = String(v ?? '')
})

const showClear = computed(() =>
  props.clearable
  && !props.disabled
  && !props.readonly
  && innerValue.value !== '',
)

// 透传属性（剔除 class，class 已由容器接管）
const attrs = useAttrs() as Record<string, unknown>
const containerClass = computed(() => attrs.class as string | undefined)
const inputAttrs = computed<Record<string, unknown>>(() => {
  const { class: _omit, ...rest } = attrs
  return rest
})

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  innerValue.value = value
  emit('update:modelValue', value)
}

const handleChange = () => {
  emit('change', innerValue.value)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') emit('enter', innerValue.value)
}

const handleClear = () => {
  innerValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="x-input relative w-full" :class="containerClass">
    <Input
      :model-value="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="inputAttrs"
      @input="handleInput"
      @change="handleChange"
      @keydown="handleKeydown"
    >
    </Input>
    <!-- 清空按钮 -->
    <button
      v-if="showClear"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex size-4 cursor-pointer items-center justify-center rounded-full bg-muted-foreground/40 text-background transition-opacity hover:bg-muted-foreground/60"
      aria-label="清空"
      @click="handleClear"
    >
      <XIcon name="X" :size="10" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import {
  X_RADIO_BOX_INACTIVE_CLASS,
  X_RADIO_BOX_SIZE_MAP,
  type XRadioBoxOption,
  type XRadioBoxSize,
} from './constant'

const props = defineProps({
  /** 当前选中值，支持 v-model */
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<XRadioBoxOption[]>,
    default: () => [],
  },
  /** 尺寸 */
  size: {
    type: String as PropType<XRadioBoxSize>,
    default: 'medium',
  },
  /** 是否撑满父级宽度 */
  block: {
    type: Boolean,
    default: false,
  },
  /** 是否整体禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const sizeConf = computed(() => X_RADIO_BOX_SIZE_MAP[props.size])

// 圆角跟随全局 --radius：min() 封顶胶囊高度（px-1.5 档约 26px 高 → 半径 13px），直角档归零变方角
const itemRadiusStyle = computed(() => ({
  borderRadius: `min(calc(var(--radius) * 10), 0.8rem)`,
}))

const handleSelect = (option: XRadioBoxOption) => {
  if (props.disabled || option.disabled || option.value === props.modelValue) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <div
    role="radiogroup"
    class="x-radio-box flex items-center gap-x-2"
    :class="[block ? 'w-full' : 'inline-flex', disabled ? 'pointer-events-none opacity-60' : '']"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :disabled="disabled || option.disabled"
      class="x-radio-box-item inline-flex items-center justify-center whitespace-nowrap border-0 font-medium leading-none transition-colors duration-200"
      :class="[
        sizeConf.item,
        block ? 'flex-1' : '',
        option.value === modelValue
          ? 'bg-primary text-primary-foreground shadow-sm'
          : X_RADIO_BOX_INACTIVE_CLASS,
        (disabled || option.disabled) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      ]"
      :style="itemRadiusStyle"
      @click="handleSelect(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, type PropType } from 'vue'
import {
  X_RADIO_GROUP_SIZE_MAP,
  type XRadioGroupOption,
  type XRadioGroupSize,
} from './constant'

const props = defineProps({
  /** 当前选中值，支持 v-model；null 表示未选择 */
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: null,
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<XRadioGroupOption[]>,
    default: () => [],
  },
  /** 原生 radio 的 name，不传时自动生成（保证同组互斥 + 键盘方向键切换） */
  name: {
    type: String,
    default: '',
  },
  /** 排列方向 */
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  /** 尺寸 */
  size: {
    type: String as PropType<XRadioGroupSize>,
    default: 'medium',
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

const uid = useId()
const groupName = computed(() => props.name || `x-radio-group-${uid}`)
const sizeConf = computed(() => X_RADIO_GROUP_SIZE_MAP[props.size])

const isDisabled = (option: XRadioGroupOption) => props.disabled || !!option.disabled
const isChecked = (option: XRadioGroupOption) => option.value === props.modelValue

const handleSelect = (option: XRadioGroupOption) => {
  if (isDisabled(option) || isChecked(option)) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <div
    role="radiogroup"
    class="x-radio-group flex"
    :class="[
      direction === 'vertical' ? 'flex-col gap-y-2' : 'flex-wrap items-center gap-x-4 gap-y-2',
      disabled ? 'opacity-60' : '',
    ]"
  >
    <label
      v-for="option in options"
      :key="String(option.value)"
      class="relative inline-flex items-start gap-2 select-none"
      :class="[sizeConf.label, isDisabled(option) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
    >
      <input
        type="radio"
        class="peer sr-only left-0 top-0"
        :name="groupName"
        :value="String(option.value)"
        :checked="isChecked(option)"
        :disabled="isDisabled(option)"
        @change="handleSelect(option)"
      >
      <span
        class="mt-0.5 grid shrink-0 place-items-center rounded-full border border-input bg-background transition-colors peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-checked:[&>span]:opacity-100"
        :class="sizeConf.dot"
      >
        <span class="rounded-full bg-primary opacity-0 transition-opacity" :class="sizeConf.dotInner" />
      </span>
      <span class="min-w-0 leading-5">{{ option.label ?? String(option.value) }}</span>
    </label>
  </div>
</template>
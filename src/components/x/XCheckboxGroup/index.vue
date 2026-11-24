<script setup lang="ts">
import { computed, ref, useId, watchEffect, type PropType } from 'vue'
import XIcon from '@/components/x/XIcon'
import {
  X_CHECKBOX_GROUP_SIZE_MAP,
  type XCheckboxGroupOption,
  type XCheckboxGroupSize,
} from './constant'

const props = defineProps({
  /** 当前选中值数组，支持 v-model */
  modelValue: {
    type: Array as PropType<(string | number)[]>,
    default: () => [],
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<XCheckboxGroupOption[]>,
    default: () => [],
  },
  /** 原生 checkbox 的 name，不传时自动生成 */
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
    type: String as PropType<XCheckboxGroupSize>,
    default: 'medium',
  },
  /** 是否整体禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 是否在顶部显示「全选」复选框（部分选中时显示 indeterminate） */
  showCheckAll: {
    type: Boolean,
    default: false,
  },
  /** 全选文案 */
  checkAllLabel: {
    type: String,
    default: '全选',
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  change: [value: (string | number)[]]
}>()

const uid = useId()
const groupName = computed(() => props.name || `x-checkbox-group-${uid}`)
const sizeConf = computed(() => X_CHECKBOX_GROUP_SIZE_MAP[props.size])
const selectedValues = computed(() => new Set((props.modelValue ?? []).map(value => String(value))))

const isDisabled = (option: XCheckboxGroupOption) => props.disabled || !!option.disabled
const isChecked = (option: XCheckboxGroupOption) => selectedValues.value.has(String(option.value))

// 全选状态只统计未禁用的选项
const enabledOptions = computed(() => props.options.filter(option => !option.disabled))
const allChecked = computed(() =>
  enabledOptions.value.length > 0
  && enabledOptions.value.every(option => selectedValues.value.has(String(option.value))),
)
const partiallyChecked = computed(() =>
  !allChecked.value
  && enabledOptions.value.some(option => selectedValues.value.has(String(option.value))),
)
const checkAllDisabled = computed(() => props.disabled || enabledOptions.value.length === 0)

const checkAllRef = ref<HTMLInputElement | null>(null)
// indeterminate 只能通过 DOM 属性设置，不能写成 HTML attribute
watchEffect(() => {
  if (checkAllRef.value) checkAllRef.value.indeterminate = partiallyChecked.value
})

const handleCheckAll = (event: Event) => {
  if (checkAllDisabled.value) return
  const checked = (event.target as HTMLInputElement).checked
  const enabledKeys = enabledOptions.value.map(option => String(option.value))
  const rest = (props.modelValue ?? []).filter(value => !enabledKeys.includes(String(value)))
  const next = checked
    ? [...rest, ...enabledOptions.value.map(option => option.value)]
    : rest
  emit('update:modelValue', next)
  emit('change', next)
}

const handleChange = (option: XCheckboxGroupOption, event: Event) => {
  if (isDisabled(option)) return
  const checked = (event.target as HTMLInputElement).checked
  const current = props.modelValue ?? []
  const next = checked
    ? [...current.filter(value => String(value) !== String(option.value)), option.value]
    : current.filter(value => String(value) !== String(option.value))
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div
    role="group"
    class="x-checkbox-group flex flex-col gap-y-2"
    :class="disabled ? 'opacity-60' : ''"
  >
    <!-- 顶部全选：部分选中时显示 indeterminate -->
    <label
      v-if="showCheckAll"
      class="relative inline-flex items-start gap-2 select-none"
      :class="[sizeConf.label, checkAllDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
    >
      <input
        ref="checkAllRef"
        type="checkbox"
        class="peer sr-only left-0 top-0"
        :checked="allChecked"
        :disabled="checkAllDisabled"
        @change="handleCheckAll"
      >
      <span
        class="mt-0.5 grid shrink-0 place-items-center rounded-[4px] border border-input bg-background text-primary-foreground transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-checked:[&>svg]:opacity-100"
        :class="[sizeConf.box, partiallyChecked ? 'border-primary bg-primary [&>svg]:opacity-100' : '']"
      >
        <XIcon
          :name="partiallyChecked ? 'Minus' : 'Check'"
          :size="sizeConf.icon"
          class="opacity-0 transition-opacity"
        />
      </span>
      <span class="min-w-0 leading-5">{{ checkAllLabel }}</span>
    </label>

    <div
      class="flex"
      :class="direction === 'vertical' ? 'flex-col gap-y-2' : 'flex-wrap items-center gap-x-4 gap-y-2'"
    >
      <label
        v-for="option in options"
        :key="String(option.value)"
        class="relative inline-flex items-start gap-2 select-none"
        :class="[sizeConf.label, isDisabled(option) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
      >
        <input
          type="checkbox"
          class="peer sr-only left-0 top-0"
          :name="groupName"
          :value="String(option.value)"
          :checked="isChecked(option)"
          :disabled="isDisabled(option)"
          @change="handleChange(option, $event)"
        >
        <span
          class="mt-0.5 grid shrink-0 place-items-center rounded-[4px] border border-input bg-background text-primary-foreground transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-checked:[&>svg]:opacity-100"
          :class="sizeConf.box"
        >
          <XIcon name="Check" :size="sizeConf.icon" class="opacity-0 transition-opacity" />
        </span>
        <span class="min-w-0 leading-5">{{ option.label ?? String(option.value) }}</span>
      </label>
    </div>
  </div>
</template>
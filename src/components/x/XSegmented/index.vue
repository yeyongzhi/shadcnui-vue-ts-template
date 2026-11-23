<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
import XIcon from '@/components/x/XIcon'
import { X_SEGMENTED_SIZE_MAP, type XSegmentedSize, type XSegmentedOption } from './constant'

const props = defineProps({
  /** 当前选中值，支持 v-model */
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: undefined,
  },
  /** 选项列表 */
  options: {
    type: Array as PropType<XSegmentedOption[]>,
    default: () => [],
  },
  /** 尺寸 */
  size: {
    type: String as PropType<XSegmentedSize>,
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
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null]
}>()

const sizeConf = computed(() => X_SEGMENTED_SIZE_MAP[props.size])
const optionCount = computed(() => props.options.length)
const activeIndex = computed(() => props.options.findIndex((opt) => opt.value === props.modelValue))
const trackStyle = computed(() => ({
  gridTemplateColumns: `repeat(${Math.max(optionCount.value, 1)}, minmax(0, 1fr))`,
}))
const indicatorStyle = computed(() => {
  if (activeIndex.value < 0 || optionCount.value === 0) {
    return {
      opacity: '0',
      width: '0',
      transform: 'translateX(0)',
    }
  }

  return {
    opacity: '1',
    width: `calc(100% / ${optionCount.value})`,
    transform: `translateX(${activeIndex.value * 100}%)`,
  }
})

const isSelected = (opt: XSegmentedOption) => opt.value === props.modelValue

// 全圆档检测：--radius >= 1rem 时，外框 rounded-lg 派生为全圆，
// 内部指示器与按钮项也切换为全圆胶囊保持视觉一致
const fullRound = ref(false)
let htmlObserver: MutationObserver | null = null

const checkFullRound = () => {
  const radiusPx = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius')) * 16
  fullRound.value = radiusPx >= 15
}

onMounted(() => {
  checkFullRound()
  // --radius 由 theme store 写在 html 行内 style，监听其变化即可
  htmlObserver = new MutationObserver(checkFullRound)
  htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
})
onBeforeUnmount(() => {
  htmlObserver?.disconnect()
  htmlObserver = null
})

const handleSelect = (opt: XSegmentedOption) => {
  if (props.disabled || opt.disabled || isSelected(opt)) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
}
</script>

<template>
  <div
    role="tablist"
    class="x-segmented rounded-lg border border-border bg-muted"
    :class="[
      sizeConf.track,
      block ? 'w-full' : 'inline-block',
      disabled ? 'opacity-60 pointer-events-none' : '',
    ]"
  >
    <div class="x-segmented-track relative grid items-center" :style="trackStyle">
      <div
        class="x-segmented-indicator absolute inset-y-0 z-0 bg-primary shadow-sm transition-[transform,opacity] duration-200 ease-out"
        :class="fullRound ? 'rounded-full' : 'rounded-md'"
        :style="indicatorStyle"
      />
      <button
        v-for="opt in options"
        :key="String(opt.value)"
        type="button"
        role="tab"
        :aria-selected="isSelected(opt)"
        :disabled="disabled || opt.disabled"
        class="x-segmented-item relative z-[1] inline-flex min-w-0 items-center justify-center gap-1.5 select-none whitespace-nowrap transition-colors duration-200"
        :class="[
          sizeConf.item,
          fullRound ? 'rounded-full' : 'rounded-md',
          isSelected(opt)
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
          (disabled || opt.disabled) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
        @click="handleSelect(opt)"
      >
        <XIcon v-if="opt.icon" :name="opt.icon" :size="sizeConf.iconSize" />
        <span v-if="opt.label">{{ opt.label }}</span>
      </button>
    </div>
  </div>
</template>

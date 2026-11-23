<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import XIcon from '@/components/x/XIcon'
import { X_DATE_PICKER_DEFAULT_PLACEHOLDER } from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 选中日期（'YYYY-MM-DD' 或 Date），支持 v-model；null 表示未选择 */
  modelValue: {
    type: [String, Date, null] as PropType<string | Date | null>,
    default: null,
  },
  /** 占位文案 */
  placeholder: {
    type: String,
    default: X_DATE_PICKER_DEFAULT_PLACEHOLDER,
  },
  /** 是否可清空 */
  clearable: {
    type: Boolean,
    default: true,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 禁用今天之前的日期 */
  disablePast: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  change: [value: string | null]
}>()

const open = ref(false)

// 把外部值（'YYYY-MM-DD' / Date / null）转成 CalendarDate（本地时区语义）
const calendarValue = computed<DateValue | undefined>(() => {
  if (!props.modelValue) return undefined
  if (props.modelValue instanceof Date) {
    return new CalendarDate(props.modelValue.getFullYear(), props.modelValue.getMonth() + 1, props.modelValue.getDate())
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(props.modelValue)
  if (!match) return undefined
  return new CalendarDate(Number(match[1]), Number(match[2]), Number(match[3]))
})

// 显示文案（YYYY-MM-DD）
const displayText = computed(() => {
  const v = calendarValue.value
  if (!v) return ''
  return `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`
})

// 禁用规则
const isDateDisabled = (date: DateValue) => {
  if (!props.disablePast) return false
  const today = new Date()
  const todayDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  return date.compare(todayDate) < 0
}

const handleSelect = (value: DateValue | undefined) => {
  if (!value) return
  const next = `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`
  emit('update:modelValue', next)
  emit('change', next)
  open.value = false
}

const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null)
}

// 供 Calendar 组件 v-model 使用（Calendar 内部可能写入非 CalendarDate 的 DateValue）
const innerCalendar = ref<DateValue | undefined>(calendarValue.value)
watch(calendarValue, (v) => { innerCalendar.value = v as DateValue | undefined })
watch(innerCalendar, (v) => {
  if (!v) return
  if (calendarValue.value && v.toString() === calendarValue.value.toString()) return
  handleSelect(v as DateValue)
})
</script>

<template>
  <div class="x-date-picker relative w-full">
    <Popover v-model:open="open">
      <PopoverTrigger as-child :disabled="disabled">
        <Button
          variant="outline"
          class="w-full justify-start px-3 font-normal hover:bg-background"
        >
          <XIcon name="Calendar" :size="14" class="text-muted-foreground" />
          <span :class="displayText ? '' : 'text-muted-foreground font-normal'">
            {{ displayText || placeholder }}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 z-[100]" align="start">
        <Calendar
          v-model="(innerCalendar as DateValue | undefined)"
          locale="zh-CN"
          layout="month-and-year"
          initial-focus
          :is-date-disabled="isDateDisabled"
        />
        <div v-if="clearable && displayText" class="flex justify-end border-t border-border px-2 py-1.5">
          <Button variant="ghost" size="sm" class="h-7 text-muted-foreground" @click="handleClear">
            清空
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

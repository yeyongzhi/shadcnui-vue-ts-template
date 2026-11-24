<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import XIcon from '@/components/x/XIcon'
import XClearButton from '@/components/x/XClearButton'
import XSelect from '@/components/x/XSelect'
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
  /** 是否选择到时分秒精度 */
  showTime: {
    type: Boolean,
    default: false,
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
const timeOpen = ref(false)

const parseModelValue = (value: string | Date | null) => {
  if (!value) return undefined
  if (value instanceof Date) {
    return {
      date: new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate()),
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds(),
    }
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value)
  if (!match) return undefined
  return {
    date: new CalendarDate(Number(match[1]), Number(match[2]), Number(match[3])),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
    second: Number(match[6] ?? 0),
  }
}

const parsedValue = computed(() => parseModelValue(props.modelValue))
const calendarValue = computed<DateValue | undefined>(() => parsedValue.value?.date)
const hour = ref(parsedValue.value?.hour ?? 0)
const minute = ref(parsedValue.value?.minute ?? 0)
const second = ref(parsedValue.value?.second ?? 0)
const padTime = (value: number) => String(value).padStart(2, '0')
const timeOptions = (count: number, suffix: string) => Array.from({ length: count }, (_, value) => ({
  value,
  label: `${padTime(value)}${suffix}`,
}))
const hourOptions = timeOptions(24, '时')
const minuteOptions = timeOptions(60, '分')
const secondOptions = timeOptions(60, '秒')

// 显示文案（YYYY-MM-DD）
const displayText = computed(() => {
  const v = calendarValue.value
  if (!v) return ''
  const date = `${v.year}-${padTime(v.month)}-${padTime(v.day)}`
  return props.showTime ? `${date} ${padTime(hour.value)}:${padTime(minute.value)}:${padTime(second.value)}` : date
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
  const date = `${value.year}-${padTime(value.month)}-${padTime(value.day)}`
  const next = props.showTime ? `${date} ${padTime(hour.value)}:${padTime(minute.value)}:${padTime(second.value)}` : date
  emit('update:modelValue', next)
  emit('change', next)
  if (!props.showTime) open.value = false
}

const handleTimeChange = (part: 'hour' | 'minute' | 'second', value: string | number | null) => {
  if (value === null) return
  if (part === 'hour') hour.value = Number(value)
  if (part === 'minute') minute.value = Number(value)
  if (part === 'second') second.value = Number(value)
  if (innerCalendar.value) handleSelect(innerCalendar.value)
}

const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null)
  innerCalendar.value = undefined
  hour.value = 0
  minute.value = 0
  second.value = 0
  open.value = false
}

// 供 Calendar 组件 v-model 使用（Calendar 内部可能写入非 CalendarDate 的 DateValue）
const innerCalendar = ref<DateValue | undefined>(calendarValue.value)
watch(parsedValue, (value) => {
  innerCalendar.value = value?.date
  hour.value = value?.hour ?? 0
  minute.value = value?.minute ?? 0
  second.value = value?.second ?? 0
})
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
          <XClearButton
            v-if="clearable && displayText && !disabled"
            label="清除日期"
            class="ml-auto"
            @clear="handleClear"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-max min-w-[18rem] max-w-[calc(100vw-2rem)] p-0 z-[100]" align="start">
        <Calendar
          v-model="(innerCalendar as DateValue | undefined)"
          locale="zh-CN"
          layout="month-and-year"
          initial-focus
          :is-date-disabled="isDateDisabled"
        >
          <template #calendar-heading="{ date, month, year }">
            <div class="flex w-full items-center justify-between gap-2">
              <div class="flex items-center gap-1">
                <component :is="year" :date="date" />
                <component :is="month" :date="date" />
              </div>
              <Popover v-if="showTime" v-model:open="timeOpen">
                <PopoverTrigger as-child>
                  <Button variant="outline" size="sm" class="h-8 px-2 font-normal tabular-nums">
                    {{ padTime(hour) }}:{{ padTime(minute) }}:{{ padTime(second) }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="z-[110] w-72 p-3" align="end" side="bottom">
                  <div class="flex items-center gap-1">
                    <XSelect
                      :model-value="hour"
                      :options="hourOptions"
                      :clearable="false"
                      size="sm"
                      class="w-20"
                      aria-label="小时"
                      @update:model-value="value => handleTimeChange('hour', value)"
                    />
                    <span class="text-muted-foreground">:</span>
                    <XSelect
                      :model-value="minute"
                      :options="minuteOptions"
                      :clearable="false"
                      size="sm"
                      class="w-20"
                      aria-label="分钟"
                      @update:model-value="value => handleTimeChange('minute', value)"
                    />
                    <span class="text-muted-foreground">:</span>
                    <XSelect
                      :model-value="second"
                      :options="secondOptions"
                      :clearable="false"
                      size="sm"
                      class="w-20"
                      aria-label="秒钟"
                      @update:model-value="value => handleTimeChange('second', value)"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </template>
        </Calendar>
        <div v-if="clearable" class="flex justify-end border-t border-border px-2 py-1.5">
          <Button variant="ghost" size="sm" class="h-7 text-muted-foreground" @click="handleClear">
            清空
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

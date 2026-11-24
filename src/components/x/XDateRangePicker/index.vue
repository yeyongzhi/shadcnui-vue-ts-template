<script setup lang="ts">
import { computed, ref, shallowRef, watch, type PropType } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import { createMonth, createYear, createYearRange } from 'reka-ui/date'
import {
  DateRangePickerRoot,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerGrid,
  DateRangePickerGridHead,
  DateRangePickerGridBody,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
} from 'reka-ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import XIcon from '@/components/x/XIcon'
import XClearButton from '@/components/x/XClearButton'
import XSelect from '@/components/x/XSelect'
import { cn } from '@/lib/utils'
import {
  X_DATE_RANGE_DEFAULT_END_PLACEHOLDER,
  X_DATE_RANGE_DEFAULT_START_PLACEHOLDER,
} from './constant'

defineOptions({ inheritAttrs: false })

/** 起止日期值（'YYYY-MM-DD'），start/end 可为 null 表示未选 */
export interface XDateRangeValue {
  start: string | null
  end: string | null
}

const props = defineProps({
  /** 起止日期，支持 v-model：{ start: 'YYYY-MM-DD' | null, end: 'YYYY-MM-DD' | null } */
  modelValue: {
    type: Object as PropType<XDateRangeValue>,
    default: () => ({ start: null, end: null }),
  },
  /** 开始日期占位文案 */
  startPlaceholder: {
    type: String,
    default: X_DATE_RANGE_DEFAULT_START_PLACEHOLDER,
  },
  /** 结束日期占位文案 */
  endPlaceholder: {
    type: String,
    default: X_DATE_RANGE_DEFAULT_END_PLACEHOLDER,
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
  /** 禁用今天之后的日期 */
  disableFuture: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: XDateRangeValue]
  change: [value: XDateRangeValue]
}>()

const open = ref(false)
const startTimeOpen = ref(false)
const endTimeOpen = ref(false)
const now = new Date()
/** 两个面板各自展示的月份（互不影响） */
const initialMonth = new CalendarDate(now.getFullYear(), now.getMonth() + 1, 1)
const panelMonths = shallowRef<DateValue[]>([initialMonth, initialMonth.add({ months: 1 })])
const startTime = ref({ hour: 0, minute: 0, second: 0 })
const endTime = ref({ hour: 0, minute: 0, second: 0 })
const padTime = (value: number) => String(value).padStart(2, '0')
const timeOptions = (count: number, suffix: string) => Array.from({ length: count }, (_, value) => ({
  value,
  label: `${padTime(value)}${suffix}`,
}))
const hourOptions = timeOptions(24, '时')
const minuteOptions = timeOptions(60, '分')
const secondOptions = timeOptions(60, '秒')

const parseTime = (value: string | null | undefined) => {
  const match = /\d{4}-\d{2}-\d{2}[T\s](\d{2}):(\d{2})(?::(\d{2}))?/.exec(value ?? '')
  return {
    hour: Number(match?.[1] ?? 0),
    minute: Number(match?.[2] ?? 0),
    second: Number(match?.[3] ?? 0),
  }
}

/** 'YYYY-MM-DD' | null → CalendarDate | undefined */
const toDateValue = (s: string | null): CalendarDate | undefined => {
  if (!s) return undefined
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
  if (!m) return undefined
  return new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3]))
}

/** DateValue → 'YYYY-MM-DD' */
const toStr = (v: unknown): string | null => {
  const d = v as CalendarDate | undefined | null
  if (!d || typeof d.year !== 'number') return null
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

// 外部值 → reka-ui range 结构
const calendarValue = computed(() => ({
  start: toDateValue(props.modelValue?.start),
  end: toDateValue(props.modelValue?.end),
}))

watch(() => props.modelValue, (value) => {
  startTime.value = parseTime(value?.start)
  endTime.value = parseTime(value?.end)
}, { immediate: true })

const monthStartOf = (date: DateValue) => new CalendarDate(date.year, date.month, 1)

watch(open, (isOpen) => {
  if (!isOpen) return
  const base = monthStartOf(calendarValue.value.start ?? calendarValue.value.end ?? initialMonth)
  panelMonths.value = [base, base.add({ months: 1 })]
})

const monthOptions = (date: DateValue) => createYear({ dateObj: date }).map(month => ({
  value: month.month,
  label: `${month.month}月`,
}))

const yearOptions = (date: DateValue) => createYearRange({
  start: date.cycle('year', -100),
  end: date.cycle('year', 10),
}).map(year => ({
  value: year.year,
  label: `${year.year}年`,
}))

/** 只改指定面板的月份，两个面板互不影响 */
const panelMonthAt = (index: number) => panelMonths.value[index] ?? initialMonth

const setPanelMonth = (index: number, date: DateValue) => {
  const next = [...panelMonths.value]
  next[index] = monthStartOf(date)
  panelMonths.value = next
}

const shiftPanelMonth = (index: number, months: number) => {
  setPanelMonth(index, panelMonthAt(index).add({ months }))
}

const updateDisplayedMonth = (index: number, part: 'month' | 'year', value: string | number | null) => {
  if (value === null) return
  const current = panelMonthAt(index)
  setPanelMonth(index, part === 'month'
    ? current.set({ month: Number(value) })
    : current.set({ year: Number(value) }))
}

/** 面板网格：与 reka 内部一致，按周一开头生成本月 + 前后补位日期 */
const panelGrids = computed(() =>
  panelMonths.value.map(dateObj => createMonth({ dateObj, weekStartsOn: 1, fixedWeeks: false, locale: 'zh-CN' })),
)

// 显示文案
const startText = computed(() => props.modelValue?.start ?? '')
const endText = computed(() => props.modelValue?.end ?? '')

const emitRange = (range: { start?: unknown, end?: unknown }) => {
  const next: XDateRangeValue = {
    start: toStr(range.start),
    end: toStr(range.end),
  }
  if (props.showTime) {
    if (next.start) next.start += ` ${padTime(startTime.value.hour)}:${padTime(startTime.value.minute)}:${padTime(startTime.value.second)}`
    if (next.end) next.end += ` ${padTime(endTime.value.hour)}:${padTime(endTime.value.minute)}:${padTime(endTime.value.second)}`
  }
  emit('update:modelValue', next)
  emit('change', next)
}

// 供 DateRangePickerRoot v-model 使用（reka-ui range 模式，值为 DateRange）
const innerRange = ref<DateRange | undefined>(calendarValue.value.start || calendarValue.value.end
  ? ({ start: calendarValue.value.start, end: calendarValue.value.end } as DateRange)
  : undefined)

// 双向同步做字符串比较（同 XForm 的防循环策略：引用不同但内容相同不触发）
const sameDate = (a: unknown, b: unknown) =>
  String((a as { toString(): string })?.toString() ?? '') === String((b as { toString(): string })?.toString() ?? '')

watch(calendarValue, (v) => {
  if (!sameDate(v.start, innerRange.value?.start) || !sameDate(v.end, innerRange.value?.end)) {
    innerRange.value = (v.start || v.end
      ? { start: v.start, end: v.end }
      : undefined) as DateRange | undefined
  }
})
// 禁用未来日期
const isDateDisabled = (date: DateValue) => {
  if (!props.disableFuture) return false
  const today = new Date()
  const todayDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  return date.compare(todayDate) > 0
}

const handleClear = () => {
  innerRange.value = undefined
}

const handleTriggerClear = () => {
  innerRange.value = undefined
  emitRange({})
  open.value = false
}

const handleQuickRange = (range: 'week' | 'month' | 'quarter') => {
  const current = new Date()
  const end = new CalendarDate(current.getFullYear(), current.getMonth() + 1, current.getDate())
  const start = range === 'week'
    ? end.subtract({ days: 6 })
    : end.subtract({ months: range === 'month' ? 1 : 3 })

  innerRange.value = { start, end } as DateRange
  // 快捷范围后把两个面板对齐到区间起点，避免仍停留在旧月份
  const startMonth = monthStartOf(start)
  panelMonths.value = [startMonth, startMonth.add({ months: 1 })]
}

const handleRangeUpdate = (value: unknown) => {
  innerRange.value = value as DateRange | undefined
}

const handleTimeChange = (which: 'start' | 'end', part: 'hour' | 'minute' | 'second', value: string | number | null) => {
  if (value === null) return
  const time = which === 'start' ? startTime.value : endTime.value
  time[part] = Number(value)
}

const timeLabel = (which: 'start' | 'end') => {
  const time = which === 'start' ? startTime.value : endTime.value
  return `${padTime(time.hour)}:${padTime(time.minute)}:${padTime(time.second)}`
}

const timeValue = (which: 'start' | 'end', part: 'hour' | 'minute' | 'second') =>
  (which === 'start' ? startTime.value : endTime.value)[part]

const setTimePopoverOpen = (which: 'start' | 'end', value: boolean) => {
  startTimeOpen.value = which === 'start' && value
  endTimeOpen.value = which === 'end' && value
}

const handleCancel = () => {
  innerRange.value = (calendarValue.value.start || calendarValue.value.end
    ? { start: calendarValue.value.start, end: calendarValue.value.end }
    : undefined) as DateRange | undefined
  startTime.value = parseTime(props.modelValue?.start)
  endTime.value = parseTime(props.modelValue?.end)
  open.value = false
}

const handleConfirm = () => {
  emitRange(innerRange.value ?? {})
  open.value = false
}

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
</script>

<template>
  <div class="x-date-range-picker relative w-full" :class="{ 'pointer-events-none opacity-50': disabled }">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <!-- 默认：一个输入框样式的触发器，内部前后两段展示起止日期 -->
        <Button
          variant="outline"
          class="w-full justify-start px-3 font-normal hover:bg-background"
          v-bind="{ ...$attrs, class: undefined }"
        >
          <XIcon name="CalendarRange" :size="14" class="text-muted-foreground shrink-0" />
          <span
            class="flex-1 truncate text-center"
            :class="startText ? '' : 'text-muted-foreground'"
          >
            {{ startText || startPlaceholder }}
          </span>
          <span class="shrink-0 text-muted-foreground">-</span>
          <span
            class="flex-1 truncate text-center"
            :class="endText ? '' : 'text-muted-foreground'"
          >
            {{ endText || endPlaceholder }}
          </span>
          <XClearButton
            v-if="clearable && (startText || endText) && !disabled"
            label="清除日期范围"
            class="ml-auto"
            @clear="handleTriggerClear"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-max min-w-[36rem] max-w-[calc(100vw-2rem)] p-0 z-[100]" align="start">
        <!-- 点击后展开双面板选择起止日期（每个面板各自独立翻页） -->
        <DateRangePickerRoot
          :model-value="(innerRange as DateRange | undefined)"
          :placeholder="panelMonths[0]"
          locale="zh-CN"
          :number-of-months="1"
          :week-starts-on="1"
          :is-date-disabled="isDateDisabled"
          @update:model-value="handleRangeUpdate"
        >
          <DateRangePickerCalendar :class="cn('p-3')">
          <div class="flex gap-x-4">
            <template v-for="(monthGrid, monthIndex) in panelGrids" :key="monthIndex">
              <div class="flex min-w-0 flex-1 flex-col">
                <DateRangePickerHeader class="flex items-center justify-between gap-1 pt-0">
                  <Button
                    variant="ghost"
                    class="size-8 p-0 opacity-50 hover:opacity-100"
                    aria-label="上一个月"
                    @click="shiftPanelMonth(monthIndex, -1)"
                  >
                    <XIcon name="ChevronLeft" :size="16" />
                  </Button>
                  <div class="flex min-w-0 items-center gap-1">
                    <XSelect
                      :model-value="monthGrid.value.year"
                      :options="yearOptions(monthGrid.value)"
                      :clearable="false"
                      size="sm"
                      class="w-20"
                      @update:model-value="value => updateDisplayedMonth(monthIndex, 'year', value)"
                    />
                    <XSelect
                      :model-value="monthGrid.value.month"
                      :options="monthOptions(monthGrid.value)"
                      :clearable="false"
                      size="sm"
                      class="w-[4.5rem]"
                      @update:model-value="value => updateDisplayedMonth(monthIndex, 'month', value)"
                    />
                    <Popover
                      v-if="showTime"
                      :open="monthIndex === 0 ? startTimeOpen : endTimeOpen"
                      @update:open="value => setTimePopoverOpen(monthIndex === 0 ? 'start' : 'end', value)"
                    >
                      <PopoverTrigger as-child>
                        <Button variant="outline" size="sm" class="h-8 shrink-0 px-2 font-normal tabular-nums">
                          {{ timeLabel(monthIndex === 0 ? 'start' : 'end') }}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="z-[110] w-72 p-3" align="end" side="bottom">
                        <div class="flex items-center gap-1">
                          <XSelect
                            :model-value="timeValue(monthIndex === 0 ? 'start' : 'end', 'hour')"
                            :options="hourOptions"
                            :clearable="false"
                            size="sm"
                            class="w-20"
                            aria-label="小时"
                            @update:model-value="value => handleTimeChange(monthIndex === 0 ? 'start' : 'end', 'hour', value)"
                          />
                          <span class="text-muted-foreground">:</span>
                          <XSelect
                            :model-value="timeValue(monthIndex === 0 ? 'start' : 'end', 'minute')"
                            :options="minuteOptions"
                            :clearable="false"
                            size="sm"
                            class="w-20"
                            aria-label="分钟"
                            @update:model-value="value => handleTimeChange(monthIndex === 0 ? 'start' : 'end', 'minute', value)"
                          />
                          <span class="text-muted-foreground">:</span>
                          <XSelect
                            :model-value="timeValue(monthIndex === 0 ? 'start' : 'end', 'second')"
                            :options="secondOptions"
                            :clearable="false"
                            size="sm"
                            class="w-20"
                            aria-label="秒钟"
                            @update:model-value="value => handleTimeChange(monthIndex === 0 ? 'start' : 'end', 'second', value)"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    variant="ghost"
                    class="size-8 p-0 opacity-50 hover:opacity-100"
                    aria-label="下一个月"
                    @click="shiftPanelMonth(monthIndex, 1)"
                  >
                    <XIcon name="ChevronRight" :size="16" />
                  </Button>
                </DateRangePickerHeader>

                <DateRangePickerGrid class="mt-2">
                  <DateRangePickerGridHead>
                    <DateRangePickerGridRow>
                      <DateRangePickerHeadCell
                        v-for="(day, i) in weekDays"
                        :key="i"
                        class="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
                      >
                        {{ day }}
                      </DateRangePickerHeadCell>
                    </DateRangePickerGridRow>
                  </DateRangePickerGridHead>
                  <DateRangePickerGridBody>
                    <DateRangePickerGridRow
                      v-for="(week, wi) in monthGrid.rows"
                      :key="`m${monthIndex}-w${wi}`"
                      class="mt-2 w-full"
                    >
                      <DateRangePickerCell
                        v-for="cellDate in week"
                        :key="cellDate.toString()"
                        :date="cellDate"
                        :month="monthGrid.value"
                      >
                        <DateRangePickerCellTrigger
                          :day="cellDate"
                          :month="monthGrid.value"
                          class="flex size-9 items-center justify-center whitespace-nowrap rounded-md text-foreground outline-none transition-[color,box-shadow] hover:bg-accent hover:text-accent-foreground data-[selection-start]:rounded-md data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-end]:rounded-md data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[outside-month]:text-muted-foreground/60 data-[outside-month]:opacity-50 data-[disabled]:text-muted-foreground data-[disabled]:opacity-50 data-[unavailable]:line-through data-[unavailable]:opacity-50"
                        />
                      </DateRangePickerCell>
                    </DateRangePickerGridRow>
                  </DateRangePickerGridBody>
                </DateRangePickerGrid>
              </div>
            </template>
          </div>
          </DateRangePickerCalendar>
        </DateRangePickerRoot>

        <!-- 底部：快捷范围 + 操作按钮 -->
        <div class="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
          <div class="flex min-w-0 flex-wrap items-center gap-1">
            <Button variant="ghost" size="sm" class="h-8 px-2 text-muted-foreground" @click="handleQuickRange('week')">
              近一周
            </Button>
            <Button variant="ghost" size="sm" class="h-8 px-2 text-muted-foreground" @click="handleQuickRange('month')">
              近一个月
            </Button>
            <Button variant="ghost" size="sm" class="h-8 px-2 text-muted-foreground" @click="handleQuickRange('quarter')">
              近三个月
            </Button>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <Button v-if="clearable" variant="ghost" size="sm" class="h-8 text-muted-foreground" @click="handleClear">
              清空
            </Button>
            <Button variant="outline" size="sm" class="h-8" @click="handleCancel">取消</Button>
            <Button size="sm" class="h-8" :disabled="!innerRange?.start || !innerRange?.end" @click="handleConfirm">
              确认
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

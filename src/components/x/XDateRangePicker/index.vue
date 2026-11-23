<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import {
  DateRangePickerRoot,
  DateRangePickerCalendar,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerPrev,
  DateRangePickerNext,
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
import XText from '@/components/x/XText'
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

// 显示文案
const startText = computed(() => props.modelValue?.start ?? '')
const endText = computed(() => props.modelValue?.end ?? '')

const emitRange = (range: { start?: unknown, end?: unknown }) => {
  const next: XDateRangeValue = {
    start: toStr(range.start),
    end: toStr(range.end),
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
watch(innerRange, (v) => {
  if (sameDate(v?.start, calendarValue.value.start) && sameDate(v?.end, calendarValue.value.end)) return
  emitRange(v ?? {})
})

// 禁用未来日期
const isDateDisabled = (date: DateValue) => {
  if (!props.disableFuture) return false
  const today = new Date()
  const todayDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  return date.compare(todayDate) > 0
}

const handleClear = () => {
  emitRange({ start: undefined, end: undefined })
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
            class="flex-1 truncate text-left"
            :class="startText ? '' : 'text-muted-foreground'"
          >
            {{ startText || startPlaceholder }}
          </span>
          <XIcon name="ChevronRight" :size="12" class="text-muted-foreground shrink-0" />
          <span
            class="flex-1 truncate text-left"
            :class="endText ? '' : 'text-muted-foreground'"
          >
            {{ endText || endPlaceholder }}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 z-[100]" align="start">
        <!-- 点击后展开双面板选择起止日期 -->
        <DateRangePickerRoot
          :model-value="(innerRange as DateRange | undefined)"
          locale="zh-CN"
          :number-of-months="2"
          :week-starts-on="1"
          :is-date-disabled="isDateDisabled"
          @update:model-value="(v: unknown) => { innerRange = v as DateRange | undefined }"
        >
          <DateRangePickerCalendar
            v-slot="{ grid, weekDays: days }"
            :class="cn('p-3')"
          >
          <div class="flex gap-x-4">
            <template v-for="(monthGrid, monthIndex) in grid" :key="monthIndex">
              <div class="flex min-w-0 flex-1 flex-col">
                <DateRangePickerHeader class="pt-0">
                  <DateRangePickerHeading class="text-sm font-medium" />
                  <nav class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between">
                    <DateRangePickerPrev
                      v-if="monthIndex === 0"
                      class="pointer-events-auto inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent opacity-70 transition-opacity hover:opacity-100"
                    >
                      <XIcon name="ChevronLeft" :size="14" />
                    </DateRangePickerPrev>
                    <DateRangePickerNext
                      v-else
                      class="pointer-events-auto inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent opacity-70 transition-opacity hover:opacity-100"
                    >
                      <XIcon name="ChevronRight" :size="14" />
                    </DateRangePickerNext>
                  </nav>
                </DateRangePickerHeader>

                <DateRangePickerGrid class="mt-2">
                  <DateRangePickerGridHead>
                    <DateRangePickerGridRow>
                      <DateRangePickerHeadCell
                        v-for="(day, i) in days"
                        :key="i"
                        class="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
                      >
                        {{ weekDays[i] ?? day }}
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

        <!-- 底部：区间回显 + 清空 -->
        <div class="flex items-center justify-between border-t border-border px-2 py-1.5">
          <XText v-if="startText && endText" type="secondary" size="xs">
            {{ startText }} ~ {{ endText }}
          </XText>
          <XText v-else type="secondary" size="xs">请选择起止日期</XText>
          <Button v-if="clearable" variant="ghost" size="sm" class="h-7 text-muted-foreground" @click="handleClear">
            清空
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

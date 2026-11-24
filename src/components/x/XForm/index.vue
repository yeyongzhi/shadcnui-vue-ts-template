<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch as XSwitch } from '@/components/ui/switch'
import XInput from '@/components/x/XInput'
import XSelect from '@/components/x/XSelect'
import XDatePicker from '@/components/x/XDatePicker'
import XDateRangePicker from '@/components/x/XDateRangePicker'
import XRadioBox from '@/components/x/XRadioBox'
import toast from '@/plugins/message'
import {
  X_FORM_DEFAULT_LABEL_WIDTH,
  X_FORM_PLACEHOLDER_MAP,
  type XFormField,
} from './constant'

const props = defineProps({
  /** 表单数据对象（双向绑定，支持 v-model） */
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  /** 表单项配置 */
  fields: {
    type: Array as PropType<XFormField[]>,
    required: true,
  },
  /** 标签宽度（px） */
  labelWidth: {
    type: Number,
    default: X_FORM_DEFAULT_LABEL_WIDTH,
  },
  /** 是否禁用整个表单 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 标签位置 */
  labelPosition: {
    type: String as PropType<'left' | 'top'>,
    default: 'left',
  },
  /** 每行表单项数（labelPosition: left 时按「标签+控件」一组计）；窄容器自动降为单列 */
  columns: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

defineExpose({
  /** 校验（required 项），返回是否通过 */
  validate: () => validate(),
  /** 校验并 toast 提示失败项 */
  validateAndToast: () => validateAndToast(),
})

// 本地草稿，避免未提交的输入直接改动外部对象。
// 双向同步必须做「值相等」短路：deep watch 对新对象引用必然触发，
// 若外部回传内容与草稿相同还赋新引用，会与父层形成互刷死循环（页面卡死）。
const draft = ref<Record<string, any>>({ ...props.modelValue })

const isSameModel = (a: Record<string, any>, b: Record<string, any>) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)

watch(() => props.modelValue, (v) => {
  if (!isSameModel(v, draft.value)) draft.value = { ...v }
}, { deep: true })

watch(draft, (v) => {
  if (!isSameModel(v, props.modelValue)) emit('update:modelValue', { ...v })
}, { deep: true })

const placeholderOf = (field: XFormField) =>
  field.placeholder ?? X_FORM_PLACEHOLDER_MAP[field.type ?? 'input']

const isDisabled = (field: XFormField) => props.disabled || field.disabled

// required 校验
const isFieldEmpty = (field: XFormField) => {
  const value = draft.value[field.key]
  if (field.type === 'checkbox' || field.type === 'switch') return value !== true
  return value === undefined || value === null || value === ''
    || (Array.isArray(value) && value.length === 0)
    || (typeof value === 'string' && value.trim() === '')
}

function validate(): boolean {
  for (const field of props.fields) {
    if (!field.required) continue
    if (isFieldEmpty(field)) return false
  }
  return true
}

function validateAndToast(): boolean {
  for (const field of props.fields) {
    if (!field.required) continue
    if (isFieldEmpty(field)) {
      toast.warning(`请填写「${field.label}」`)
      return false
    }
  }
  return true
}

const numberInput = (field: XFormField, e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    draft.value[field.key] = undefined
    return
  }
  let num = Number(raw)
  if (Number.isNaN(num)) return
  if (field.min !== undefined) num = Math.max(num, field.min)
  if (field.max !== undefined) num = Math.min(num, field.max)
  if (field.precision !== undefined) num = Number(num.toFixed(field.precision))
  draft.value[field.key] = num
}

const updateCheckboxGroup = (field: XFormField, optionValue: string | number, checked: boolean | 'indeterminate') => {
  const selected = Array.isArray(draft.value[field.key]) ? [...draft.value[field.key]] : []
  draft.value[field.key] = checked === true
    ? [...new Set([...selected, optionValue])]
    : selected.filter(value => value !== optionValue)
}

// 网格布局：
// - labelPosition: top → 每列 1fr
// - labelPosition: left → 「标签 控件」重复 columns 组
// 窄容器（auto 检测）→ 降级单列，避免挤压
const rootEl = ref<HTMLElement | null>(null)
const compact = ref(false)
let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width ?? 0
    // 每组需要 标签(90) + 控件(至少 160) ≈ 250px
    const groupWidth = width / Math.max(props.columns, 1)
    compact.value = groupWidth < 250
  })
  if (rootEl.value) observer.observe(rootEl.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const gridStyle = computed(() => {
  if (props.labelPosition === 'top') {
    return {
      gridTemplateColumns: compact.value
        ? '1fr'
        : `repeat(${Math.max(props.columns, 1)}, minmax(0, 1fr))`,
    }
  }
  if (compact.value) {
    return { gridTemplateColumns: `${props.labelWidth}px minmax(0, 1fr)` }
  }
  return {
    gridTemplateColumns: `repeat(${Math.max(props.columns, 1)}, ${props.labelWidth}px minmax(0, 1fr))`,
  }
})
</script>

<template>
  <div ref="rootEl" class="x-form grid items-center gap-x-4 gap-y-4" :style="gridStyle">
    <template v-for="field in fields" :key="field.key">
      <!-- 标签 -->
      <Label
        class="text-sm leading-none font-medium"
        :class="labelPosition === 'top' ? '' : 'justify-self-end text-right'"
      >
        <span v-if="field.required" class="mr-0.5 text-destructive">*</span>
        {{ field.label }}
      </Label>

      <!-- 控件区 -->
      <div class="min-w-0">
        <XSelect
          v-if="(field.type ?? 'input') === 'select'"
          v-model="draft[field.key]"
          :options="field.options ?? []"
          :placeholder="placeholderOf(field)"
          :clearable="field.clearable ?? true"
          :disabled="isDisabled(field)"
        />
        <XDatePicker
          v-else-if="field.type === 'date'"
          v-model="draft[field.key]"
          :placeholder="placeholderOf(field)"
          :show-time="field.showTime"
          :disabled="isDisabled(field)"
        />
        <XDateRangePicker
          v-else-if="field.type === 'date-range'"
          v-model="draft[field.key]"
          :disabled="isDisabled(field)"
          :show-time="field.showTime"
        />
        <XRadioBox
          v-else-if="field.type === 'radio'"
          v-model="draft[field.key]"
          :options="field.options ?? []"
          :disabled="isDisabled(field)"
        />
        <div v-else-if="field.type === 'checkbox-group'" class="flex flex-wrap gap-x-4 gap-y-2">
          <label v-for="option in field.options ?? []" :key="String(option.value)" class="flex items-center gap-2 text-sm">
            <Checkbox
              :checked="Array.isArray(draft[field.key]) && draft[field.key].includes(option.value)"
              :disabled="isDisabled(field) || option.disabled"
              @update:checked="checked => updateCheckboxGroup(field, option.value, checked)"
            />
            {{ option.label }}
          </label>
        </div>
        <label v-else-if="field.type === 'checkbox'" class="flex min-h-9 items-center gap-2 text-sm">
          <Checkbox v-model:checked="draft[field.key]" :disabled="isDisabled(field)" />
          {{ field.checkboxLabel || field.label }}
        </label>
        <div v-else-if="field.type === 'switch'" class="flex min-h-9 items-center gap-2">
          <XSwitch v-model="draft[field.key]" :disabled="isDisabled(field)" />
        </div>
        <Input
          v-else-if="field.type === 'number'"
          type="number"
          :model-value="draft[field.key] ?? ''"
          :placeholder="placeholderOf(field)"
          :disabled="isDisabled(field)"
          @change="numberInput(field, $event)"
        />
        <Textarea
          v-else-if="field.type === 'textarea'"
          v-model="draft[field.key]"
          :placeholder="placeholderOf(field)"
          :rows="field.rows ?? 3"
          :disabled="isDisabled(field)"
        />
        <XInput
          v-else-if="field.type === 'password'"
          v-model="draft[field.key]"
          type="password"
          :placeholder="placeholderOf(field)"
          :disabled="isDisabled(field)"
          :clearable="false"
        />
        <component
          :is="field.render"
          v-else-if="field.type === 'custom' && field.render"
          :model="draft"
        />
        <XInput
          v-else
          v-model="draft[field.key]"
          :placeholder="placeholderOf(field)"
          :disabled="isDisabled(field)"
          :clearable="false"
        />
      </div>
    </template>
  </div>
</template>

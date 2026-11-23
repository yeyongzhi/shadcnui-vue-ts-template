<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
import XImage from '@/components/x/XImage'
import XText from '@/components/x/XText'
import {
  X_DETAIL_DEFAULT_COLUMNS,
  X_DETAIL_DEFAULT_PLACEHOLDER,
  X_DETAIL_IMAGE_SPAN,
  type XDetailField,
} from './constant'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** 字段配置列表 */
  fields: {
    type: Array as PropType<XDetailField[]>,
    required: true,
  },
  /** 数据对象，key 与 field.key 对应 */
  data: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /** 是否有边框 */
  bordered: {
    type: Boolean,
    default: false,
  },
  /** 标签位置：left 左侧行内（默认）/ top 在值上方 */
  labelPlacement: {
    type: String as PropType<'left' | 'top'>,
    default: 'left',
  },
  /** 快捷列数：每行显示几列，自动推算 span（column=3 → span=4/4/4）；field.span 显式声明优先 */
  column: {
    type: Number,
    default: undefined,
  },
  /** 详情文字字号，统一作用于标签、值和插槽内容 */
  size: {
    type: String as PropType<'xs' | 'sm' | 'base' | 'lg' | 'xl'>,
    default: 'base',
  },
  /** 标签列宽（px，labelPlacement: left 时生效） */
  labelWidth: {
    type: Number,
    default: 96,
  },
})

defineSlots<{
  [key: `slot-${string}`]: (props: { value: any, field: XDetailField }) => any
}>()

// 完整类名映射，保证 Tailwind 扫描时不被裁剪
const sizeMap = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'base': 'text-base',
  'lg': 'text-lg',
  'xl': 'text-xl',
} as const

const sizeClass = computed(() => sizeMap[props.size])

// column 有值时按列数推算 span（默认列数 4），field.span 显式声明优先级最高
const defaultSpan = computed(() =>
  props.column
    ? Math.max(1, Math.floor(X_DETAIL_DEFAULT_COLUMNS / Math.max(1, props.column)))
    : 1,
)

const spanOf = (field: XDetailField) => {
  const span = field.span ?? (field.type === 'image' ? X_DETAIL_IMAGE_SPAN : defaultSpan.value)
  return Math.min(Math.max(span, 1), X_DETAIL_DEFAULT_COLUMNS)
}

const spanStyle = (field: XDetailField) => {
  const span = spanOf(field)
  return { gridColumn: `span ${span} / span ${span}` }
}

// 网格列数：固定 4 等分；窄容器下每列装不下「标签 + 值」，改为纵向堆叠
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${X_DETAIL_DEFAULT_COLUMNS}, minmax(0, 1fr))`,
}))

// 文本字段展示值：formatter 优先（仅影响回显），空值回退占位文案
const fieldValue = (field: XDetailField) => {
  const raw = props.data?.[field.key]
  if (field.formatter) return field.formatter(raw, props.data)
  return raw === undefined || raw === null || raw === '' ? (field.placeholder ?? X_DETAIL_DEFAULT_PLACEHOLDER) : raw
}

// image 类型支持单个 URL / URL 数组 / JSON 数组字符串，自动过滤空地址
const normalizeImages = (value: unknown): string[] => {
  let source = value
  if (typeof value === 'string') {
    const content = value.trim()
    if (!content) return []
    try {
      source = JSON.parse(content)
    }
    catch {
      source = content
    }
  }
  const list = Array.isArray(source) ? source : [source]
  return list.filter((item): item is string => typeof item === 'string' && item.trim() !== '')
}

const imageMap = computed(() => Object.fromEntries(
  props.fields
    .filter(field => field.type === 'image')
    .map(field => [field.key, normalizeImages(props.data?.[field.key])]),
))

// 窄容器检测：每列宽度不足以并排放下「标签(96px) + 值」时，item 改纵向堆叠
// （典型场景：抽屉/对话框里放单列 XDetail，4 等分后每列仅 ~100px）
const rootEl = ref<HTMLElement | null>(null)
const compact = ref(false)
let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width ?? 0
    // 单列宽 = 总宽 / 4；标签 96 + 值至少 120 才算放得下
    const colWidth = width / X_DETAIL_DEFAULT_COLUMNS
    compact.value = colWidth < 220
  })
  if (rootEl.value) observer.observe(rootEl.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div
    ref="rootEl"
    class="x-detail grid gap-x-6 gap-y-0"
    :style="gridStyle"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <div
      v-for="field in fields"
      :key="field.key"
      class="x-detail-item flex min-w-0 py-2.5"
      :class="[
        sizeClass,
        (labelPlacement === 'left' && !compact) ? 'flex-row items-start' : 'flex-col items-start gap-y-1',
        bordered ? 'border-b border-border' : '',
      ]"
      :style="spanStyle(field)"
    >
      <!-- 标签：left 行内（自适应宽度，超出省略）/ top 上方；空字符串不渲染 -->
      <span
        v-if="field.label !== ''"
        class="shrink-0 truncate text-muted-foreground"
        :style="labelPlacement === 'left' ? { maxWidth: `${labelWidth}px` } : undefined"
      >
        {{ field.label }}
      </span>
      <!-- 值 -->
      <div class="min-w-0 flex-1 break-words">
        <slot
          v-if="(field.type ?? 'text') === 'slot'"
          :name="`slot-${field.key}`"
          :value="data?.[field.key]"
          :field="field"
        />
        <!-- image 类型：多图横排缩略图，点击放大 -->
        <div
          v-else-if="field.type === 'image' && (imageMap[field.key]?.length ?? 0) > 0"
          class="flex flex-wrap gap-2"
        >
          <XImage
            v-for="(src, i) in imageMap[field.key]"
            :key="src"
            :src="src"
            :width="64"
            :height="64"
            fit="cover"
            :alt="`${field.label} ${i + 1}`"
          />
        </div>
        <XText v-else-if="field.type === 'image'">{{ field.placeholder ?? X_DETAIL_DEFAULT_PLACEHOLDER }}</XText>
        <XText v-else>{{ fieldValue(field) }}</XText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue'
import XForm from '@/components/x/XForm'
import XButton from '@/components/x/XButton'
import XIcon from '@/components/x/XIcon'
import type { XFormField } from '@/components/x/XForm'
import {
  X_SEARCH_FORM_COLLAPSED_COUNT,
  X_SEARCH_FORM_RESET_TEXT,
  X_SEARCH_FORM_SEARCH_TEXT,
} from './constant'

const props = defineProps({
  /** 查询条件对象（双向绑定，支持 v-model） */
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  /** 查询字段配置 */
  fields: {
    type: Array as PropType<XFormField[]>,
    required: true,
  },
  /** 折叠时可见的字段数 */
  collapsedCount: {
    type: Number,
    default: X_SEARCH_FORM_COLLAPSED_COUNT,
  },
  /** 查询按钮文案；传空字符串则不渲染 */
  searchText: {
    type: String,
    default: X_SEARCH_FORM_SEARCH_TEXT,
  },
  /** 重置按钮文案；传空字符串则不渲染 */
  resetText: {
    type: String,
    default: X_SEARCH_FORM_RESET_TEXT,
  },
  /** 是否显示展开/收起（字段数超过 collapsedCount 时才有意义） */
  collapsible: {
    type: Boolean,
    default: true,
  },
  /** 每行表单项数（透传给 XForm），窄容器自动降列 */
  columns: {
    type: Number,
    default: 4,
  },
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  /** 点击查询 */
  search: [value: Record<string, any>]
  /** 点击重置（model 已被重置为初始快照） */
  reset: []
}>()

const expanded = ref(false)

// 折叠时只展示前 collapsedCount 个字段
const visibleFields = computed(() => {
  if (expanded.value || !props.collapsible) return props.fields
  return props.fields.slice(0, props.collapsedCount)
})

const showToggle = computed(() =>
  props.collapsible && props.fields.length > props.collapsedCount,
)

// 初始快照：重置时恢复（新引用，避免共同引用导致重置失效）
const initialSnapshot = (): Record<string, any> => JSON.parse(JSON.stringify(props.modelValue))

const handleSearch = () => {
  emit('search', { ...props.modelValue })
}

const handleReset = () => {
  emit('update:modelValue', initialSnapshot())
  emit('reset')
}

// Enter 触发查询：监听容器 keydown 捕获阶段
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && props.searchText) {
    e.preventDefault()
    handleSearch()
  }
}

// prop 不可直接 v-model：内部草稿承接编辑，change 时回传 update:modelValue。
// 与 XForm 相同：双向同步必须「值相等」短路，否则与 App/XForm 形成 watch 互刷死循环。
const innerModel = ref<Record<string, any>>({ ...props.modelValue })

const isSameModel = (a: Record<string, any>, b: Record<string, any>) =>
  a === b || JSON.stringify(a) === JSON.stringify(b)

watch(() => props.modelValue, (v) => {
  if (!isSameModel(v, innerModel.value)) innerModel.value = { ...v }
}, { deep: true })
watch(innerModel, (v) => {
  if (!isSameModel(v, props.modelValue)) emit('update:modelValue', { ...v })
}, { deep: true })
</script>

<template>
  <div
    class="x-search-form rounded-md border border-border bg-card p-4"
    @keydown="handleKeydown"
  >
    <XForm v-model="innerModel" :fields="visibleFields" label-position="left" :columns="columns" />
    <div class="mt-3 flex items-center justify-end gap-2">
      <XButton v-if="searchText" icon="Search" size="sm" @click="handleSearch">
        {{ searchText }}
      </XButton>
      <XButton v-if="resetText" variant="outline" size="sm" @click="handleReset">
        {{ resetText }}
      </XButton>
      <XButton
        v-if="showToggle"
        variant="ghost"
        size="sm"
        class="text-muted-foreground"
        @click="expanded = !expanded"
      >
        {{ expanded ? '收起' : '展开' }}
        <XIcon :name="expanded ? 'ChevronUp' : 'ChevronDown'" :size="14" />
      </XButton>
    </div>
  </div>
</template>

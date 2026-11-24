<script setup lang="ts">
import 'vue-sonner/style.css'
import { ref } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import { Separator } from '@/components/ui/separator'
import { Switch as XSwitch_ } from '@/components/ui/switch'
import useThemeStore from '@/store/theme'
import toast from '@/plugins/message'
import XSegmented from '@/components/x/XSegmented'
import XRadioBox from '@/components/x/XRadioBox'
import XRadioGroup from '@/components/x/XRadioGroup'
import XCheckboxGroup from '@/components/x/XCheckboxGroup'
import XCard from '@/components/x/XCard'
import XButton from '@/components/x/XButton'
import XInput from '@/components/x/XInput'
import XText from '@/components/x/XText'
import XTooltip from '@/components/x/XTooltip'
import XSelect from '@/components/x/XSelect'
import XDatePicker from '@/components/x/XDatePicker'
import XDateRangePicker from '@/components/x/XDateRangePicker'
import XCopyText from '@/components/x/XCopyText'
import XEmpty from '@/components/x/XEmpty'
import XLoading from '@/components/x/XLoading'
import XDetail from '@/components/x/XDetail'
import XDataTable from '@/components/x/XDataTable'
import XSearchForm from '@/components/x/XSearchForm'
import XForm from '@/components/x/XForm'
import XDialog from '@/components/x/XDialog'
import XDrawer from '@/components/x/XDrawer'
import XImage from '@/components/x/XImage'
import XImagePreviewDialog from '@/components/x/XImagePreviewDialog'
import XIcon from '@/components/x/XIcon'
import type { XFormField } from '@/components/x/XForm'
import { h } from 'vue'

const themeStore = useThemeStore()

const modeOptions = [
  { value: 'light', label: '亮色', icon: 'Sun' },
  { value: 'dark', label: '暗色', icon: 'Moon' },
  { value: 'auto', label: '系统', icon: 'Monitor' },
]

// 圆角档位（与 store 的 RADIUS_PRESETS 同源）
const radiusOptions = [
  { value: 0, label: '直角' },
  { value: 0.25, label: '小' },
  { value: 0.5, label: '中' },
  { value: 0.625, label: '大' },
  { value: 1, label: '全圆' },
]

/** 侧边导航：仅一个「组件预览」菜单项，点击回到顶部 */
const navItems = [
  { key: 'appearance', label: '组件预览', icon: 'LayoutGrid' },
]

const asideCollapsed = ref(false)

const scrollTo = (_key: string) => {
  document.getElementById('section-appearance')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// —— 预览交互状态 ——
const selectValue = ref<number | null>(1)
const selectOptions = [
  { value: 1, label: '在线' },
  { value: 0, label: '离线' },
  { value: 2, label: '维护中', disabled: true },
]
const dateValue = ref<string | null>(null)
const dateShowTime = ref(false)
const dateRange = ref({ start: null as string | null, end: null as string | null })
const dateRangeShowTime = ref(false)
const radioValue = ref<string | number>('all')
const viewValue = ref<string | number | null>('card')
const switchOn = ref(false)

/** XRadioGroup / XCheckboxGroup 预览 */
const radioGroupValue = ref<string | number | null>('day')
const radioGroupDirection = ref<'horizontal' | 'vertical'>('horizontal')
const radioGroupSize = ref<'small' | 'medium' | 'large'>('medium')
const radioGroupOptions = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
  { value: 'quarter', label: '按季（禁用）', disabled: true },
]

const checkboxGroupValue = ref<(string | number)[]>(['email'])
const checkboxGroupDirection = ref<'horizontal' | 'vertical'>('horizontal')
const checkboxGroupSize = ref<'small' | 'medium' | 'large'>('medium')
const checkboxGroupOptions = [
  { value: 'email', label: '邮件' },
  { value: 'sms', label: '短信' },
  { value: 'inbox', label: '站内信' },
  { value: 'call', label: '电话（禁用）', disabled: true },
]
const directionOptions = [
  { value: 'horizontal', label: '横向' },
  { value: 'vertical', label: '纵向' },
]
const sizeOptions = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
]

/** 快捷属性交互：可调组件参数实时看效果 */
const btnVariant = ref<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default')
const btnSize = ref<'default' | 'sm' | 'lg'>('default')
const btnLoading = ref(false)
const btnDisabled = ref(false)
const btnIcon = ref(true)

const inputClearable = ref(true)
const inputDisabled = ref(false)

const selectDisabled = ref(false)

const loadingSize = ref(28)
const loadingOn = ref(true)

const emptyShowIcon = ref(true)
const emptyShowDesc = ref(true)

const detailBordered = ref(true)
const detailColumn = ref(2)

const tableStriped = ref(true)
const tableLoading = ref(false)
const handleTableRefresh = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    toast.success('数据已刷新')
  }, 800)
}

const dialogOpen = ref(false)
const dialogSaving = ref(false)
const drawerOpen = ref(false)
const previewOpen = ref(false)

const searchQuery = ref<Record<string, any>>({
  keyword: '',
  level: null,
  status: null,
  features: [],
  inspectedAt: null,
  activeRange: { start: null, end: null },
  count: null,
  enabled: false,
})
const formModel = ref<Record<string, any>>({
  name: '',
  password: '',
  level: null,
  status: 'active',
  enabled: true,
  confirmed: false,
  features: ['alarm'],
  inspectedAt: null,
  activeRange: { start: null, end: null },
  count: 1,
  remark: '',
})
const formFields: XFormField[] = [
  { key: 'name', label: '设备名称', required: true },
  { key: 'password', label: '访问密码', type: 'password', required: true },
  { key: 'level', label: '重要等级', type: 'select', options: [{ value: 1, label: '高' }, { value: 2, label: '低' }] },
  { key: 'status', label: '运行状态', type: 'radio', options: [{ value: 'active', label: '运行中' }, { value: 'paused', label: '已暂停' }] },
  { key: 'features', label: '告警类型', type: 'checkbox-group', options: [{ value: 'alarm', label: '故障告警' }, { value: 'warning', label: '运行预警' }, { value: 'offline', label: '离线通知' }] },
  { key: 'enabled', label: '启用设备', type: 'switch' },
  { key: 'confirmed', label: '确认配置', type: 'checkbox', placeholder: '我已核对设备配置' },
  { key: 'inspectedAt', label: '巡检时间', type: 'date', showTime: true },
  { key: 'activeRange', label: '维护时段', type: 'date-range', showTime: true },
  { key: 'count', label: '数量', type: 'number', min: 1, max: 99 },
  { key: 'remark', label: '备注', type: 'textarea', rows: 3 },
]
const formRef = ref<{ validateAndToast: () => boolean } | null>(null)
const handleFormSubmit = () => {
  if (!formRef.value?.validateAndToast()) return
  toast.success(`表单校验通过：${JSON.stringify(formModel.value)}`)
}
const searchFields: XFormField[] = [
  { key: 'keyword', label: '关键词' },
  { key: 'level', label: '等级', type: 'select', options: [{ value: 1, label: '高' }, { value: 2, label: '低' }] },
  { key: 'status', label: '运行状态', type: 'radio', options: [{ value: 'active', label: '运行中' }, { value: 'paused', label: '已暂停' }] },
  { key: 'features', label: '告警类型', type: 'checkbox-group', options: [{ value: 'alarm', label: '故障告警' }, { value: 'warning', label: '运行预警' }] },
  { key: 'inspectedAt', label: '巡检时间', type: 'date' },
  { key: 'activeRange', label: '维护时段', type: 'date-range' },
  { key: 'count', label: '设备数量', type: 'number', min: 0, max: 999 },
  { key: 'enabled', label: '仅看启用', type: 'switch' },
]

const handleDialogConfirm = () => {
  dialogSaving.value = true
  setTimeout(() => {
    dialogSaving.value = false
    dialogOpen.value = false
    toast.success('保存成功')
  }, 1200)
}

// —— 预览数据 ——
const demoImages = [
  'https://picsum.photos/seed/xui-a/600/400',
  'https://picsum.photos/seed/xui-b/600/400',
  'https://picsum.photos/seed/xui-c/600/400',
]

const detailFields = [
  { label: '设备名称', key: 'name' },
  { label: '设备编号', key: 'sn' },
  { label: '所属区域', key: 'area' },
  { label: '安装时间', key: 'installDate', formatter: (v: unknown) => (v ? `${v}（验收合格）` : v) },
  { label: '负责人', key: 'owner', placeholder: '未分配' },
  { label: '备注', key: 'remark', span: 4 },
]
const detailData = {
  name: '一号风机',
  sn: 'WT-2024-001',
  area: '西北片区',
  installDate: '2024-03-15',
  owner: '',
  remark: '已完成年度校准，运行状态良好',
}
const detailSlotFields = [
  { label: '运行状态', key: 'status', type: 'slot' as const },
  { label: '额定功率', key: 'power', formatter: (v: unknown) => (v ? `${v} kW` : v) },
  { label: '现场照片', key: 'photos', type: 'image' as const },
]
const detailSlotData = { status: 1, power: 2500, photos: JSON.stringify(demoImages) }

const tableColumns = [
  { key: 'name', title: '设备名称' },
  { key: 'sn', title: '编号', width: 140 },
  { key: 'status', title: '状态', width: 90, align: 'center' as const },
  {
    key: 'actions',
    title: '操作',
    width: 90,
    align: 'center' as const,
    render: () => h(XButton, { size: 'sm', variant: 'ghost' }, () => '详情'),
  },
]
const tableData = [
  { id: 1, name: '一号风机', sn: 'WT-001', status: 1 },
  { id: 2, name: '二号风机', sn: 'WT-002', status: 0 },
  { id: 3, name: '升压变压器', sn: 'TR-003', status: 1 },
  { id: 4, name: '汇流箱', sn: 'CB-004', status: 1 },
  { id: 5, name: '储能柜', sn: 'ES-005', status: 0 },
  { id: 6, name: '逆变器', sn: 'IV-006', status: 1 },
]

const btnVariants = [
  { value: 'default', label: 'default' },
  { value: 'secondary', label: 'secondary' },
  { value: 'outline', label: 'outline' },
  { value: 'ghost', label: 'ghost' },
  { value: 'destructive', label: 'destructive' },
  { value: 'link', label: 'link' },
] as const
const btnSizes = [
  { value: 'sm', label: 'sm' },
  { value: 'default', label: 'default' },
  { value: 'lg', label: 'lg' },
] as const

/** 快捷属性行：右侧控件组的通用布局 */
</script>

<template>
  <div class="w-full h-full flex overflow-hidden">
    <!-- 左侧：导航侧边栏（collapsed 时收缩为图标条） -->
    <aside
      class="x-aside hidden md:flex shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200"
      :class="asideCollapsed ? 'w-14' : 'w-56'"
    >
      <div class="flex items-center gap-2 px-4 py-4 border-b border-border" :class="asideCollapsed ? 'px-3 justify-center' : ''">
        <div class="size-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">S</div>
        <div v-if="!asideCollapsed" class="min-w-0">
          <p class="text-sm font-semibold leading-tight truncate">shadcn-vue 模板</p>
          <p class="text-xs text-muted-foreground leading-tight">Vue3 + TS + Tailwind 4</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1" :class="asideCollapsed ? 'px-1.5' : ''">
        <button
          v-for="item in navItems"
          :key="item.key"
          type="button"
          class="flex items-center gap-2 rounded-md text-sm text-left transition-colors cursor-pointer whitespace-nowrap"
          :class="[
            asideCollapsed ? 'justify-center px-0' : 'px-2 py-1.5',
            'text-foreground bg-accent font-medium',
          ]"
          :title="item.label"
          @click="scrollTo(item.key)"
        >
          <XIcon v-if="item.icon" :name="item.icon" :size="16" class="shrink-0" />
          <span v-if="!asideCollapsed">{{ item.label }}</span>
        </button>
      </nav>

      <!-- 收缩按钮 -->
      <button
        type="button"
        class="shrink-0 border-t border-border flex items-center justify-center py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        :title="asideCollapsed ? '展开侧边栏' : '收起侧边栏'"
        @click="asideCollapsed = !asideCollapsed"
      >
        <XIcon :name="asideCollapsed ? 'ChevronRight' : 'ChevronLeft'" :size="16" />
      </button>
    </aside>

    <!-- 右侧：标题区（固定）+ 内容区（固定高度内部滚动） -->
    <div class="flex-1 min-w-0 flex flex-col">
      <header class="shrink-0 border-b border-border bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-lg font-bold leading-tight">基于 shadcn-vue 的 Vue TS 项目模板</h1>
          <p class="text-sm text-muted-foreground leading-tight mt-0.5">主题配置与组件预览</p>
        </div>
        <XText type="secondary" size="sm" class="hidden sm:inline">主题色：{{ themeStore.currentPreset.label }}</XText>
      </header>

      <!-- 内容区：固定高度，内部滚动（滚动条隐藏，滚轮/触控板/键盘仍可滚动） -->
      <main class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div class="max-w-4xl flex flex-col gap-6 scroll-smooth">
          <!-- 外观设置 -->
          <section id="section-appearance" class="scroll-mt-4">
            <XCard title="外观设置" title-prefix>
              <div class="flex flex-col gap-5">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-muted-foreground">显示模式</span>
                  <XSegmented
                    :model-value="themeStore.mode"
                    :options="modeOptions"
                    @update:model-value="themeStore.setMode($event as any)"
                  />
                </div>
                <Separator />
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-muted-foreground whitespace-nowrap">主题色</span>
                  <XRadioBox
                    :model-value="themeStore.presetId"
                    :options="Object.values(themeStore.themePresets).flat().map(p => ({ value: p.id, label: p.label }))"
                    class="justify-end flex-wrap"
                    @update:model-value="themeStore.setPreset($event as string)"
                  />
                </div>
                <Separator />
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-muted-foreground whitespace-nowrap">全局圆角</span>
                  <XSegmented
                    :model-value="themeStore.radius"
                    :options="radiusOptions"
                    @update:model-value="themeStore.setRadius($event as any)"
                  />
                </div>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  圆角预览：
                  <span class="size-5 bg-primary rounded-sm" />
                  <span class="size-5 bg-primary rounded-md" />
                  <span class="size-5 bg-primary rounded-lg" />
                  <span class="size-5 bg-primary rounded-xl" />
                  <span>（sm / md / lg / xl 跟随全局 --radius 派生）</span>
                </div>
              </div>
            </XCard>
          </section>

          <!-- XButton -->
          <section id="section-button" class="scroll-mt-4">
            <XCard title="XButton 按钮" title-prefix>
              <div class="flex flex-col gap-4">
                <!-- 快捷属性：变体/尺寸/状态实时可调 -->
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">variant</span>
                    <XSelect v-model="btnVariant" :options="[...btnVariants]" :clearable="false" class="w-40" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">size</span>
                    <XSelect v-model="btnSize" :options="[...btnSizes]" :clearable="false" class="w-32" />
                  </div>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="btnIcon" class="scale-90" /> icon
                  </label>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="btnLoading" class="scale-90" /> loading
                  </label>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="btnDisabled" class="scale-90" /> disabled
                  </label>
                </div>
                <Separator />
                <div class="flex flex-wrap items-center gap-3 py-2">
                  <XButton
                    :variant="btnVariant"
                    :size="btnSize"
                    :icon="btnIcon ? 'Plus' : undefined"
                    :loading="btnLoading"
                    :disabled="btnDisabled"
                  >
                    示例按钮
                  </XButton>
                  <XText type="secondary" size="sm">↑ 调上方属性实时看效果</XText>
                </div>
                <Separator />
                <!-- 全变体速览 -->
                <div class="flex flex-wrap items-center gap-3">
                  <XButton>默认</XButton>
                  <XButton variant="secondary" icon="Download">下载</XButton>
                  <XButton variant="destructive" icon="Trash2">删除</XButton>
                  <XButton variant="ghost" icon="Settings">设置</XButton>
                  <XButton variant="link">链接</XButton>
                </div>
              </div>
            </XCard>
          </section>

          <!-- XInput -->
          <section id="section-input" class="scroll-mt-4">
            <XCard title="XInput 输入框" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="inputClearable" class="scale-90" /> clearable
                  </label>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="inputDisabled" class="scale-90" /> disabled
                  </label>
                </div>
                <div class="py-1">
                  <XInput placeholder="可清空输入" :clearable="inputClearable" :disabled="inputDisabled" class="max-w-sm" />
                </div>
              </div>
            </XCard>
          </section>

          <!-- XSelect -->
          <section id="section-select" class="scroll-mt-4">
            <XCard title="XSelect 下拉选择" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="selectDisabled" class="scale-90" /> disabled
                  </label>
                  <XText type="secondary" size="sm">当前值：{{ JSON.stringify(selectValue) }}</XText>
                </div>
                <Separator />
                <div class="py-1">
                  <XSelect v-model="selectValue" :options="selectOptions" placeholder="请选择状态" :disabled="selectDisabled" />
                </div>
              </div>
            </XCard>
          </section>

          <!-- XDatePicker -->
          <section id="section-datepicker" class="scroll-mt-4">
            <XCard title="XDatePicker 日期选择" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <XSwitch_ v-model="dateShowTime" class="scale-90" /> showTime
                </label>
                <XText type="secondary" size="sm">当前值：{{ dateValue ?? '未选日期' }}</XText>
                <XDatePicker v-model="dateValue" placeholder="请选择日期" :show-time="dateShowTime" />
              </div>
            </XCard>
          </section>

          <!-- XDateRangePicker -->
          <section id="section-daterange" class="scroll-mt-4">
            <XCard title="XDateRangePicker 日期范围" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <XSwitch_ v-model="dateRangeShowTime" class="scale-90" /> showTime
                </label>
                <XText type="secondary" size="sm">
                  当前值：{{ dateRange.start ?? '未选' }} ~ {{ dateRange.end ?? '未选' }}
                </XText>
                <XDateRangePicker v-model="dateRange" class="w-80" :show-time="dateRangeShowTime" />
              </div>
            </XCard>
          </section>

          <!-- XRadioBox -->
          <section id="section-radiobox" class="scroll-mt-4">
            <XCard title="XRadioBox 胶囊单选" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <XRadioBox
                  v-model="radioValue"
                  :options="[{ value: 'all', label: '全部' }, { value: 'high', label: '高风险' }]"
                />
              </div>
            </XCard>
          </section>

          <!-- XRadioGroup -->
          <section id="section-radiogroup" class="scroll-mt-4">
            <XCard title="XRadioGroup 单选" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">direction</span>
                    <XSegmented
                      :model-value="radioGroupDirection"
                      :options="directionOptions"
                      size="small"
                      @update:model-value="value => (radioGroupDirection = value as 'horizontal' | 'vertical')"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">size</span>
                    <XSegmented
                      :model-value="radioGroupSize"
                      :options="sizeOptions"
                      size="small"
                      @update:model-value="value => (radioGroupSize = value as 'small' | 'medium' | 'large')"
                    />
                  </div>
                </div>
                <XRadioGroup
                  v-model="radioGroupValue"
                  :options="radioGroupOptions"
                  :direction="radioGroupDirection"
                  :size="radioGroupSize"
                />
                <XText type="secondary" size="sm">当前值：{{ radioGroupValue ?? '未选' }}</XText>
              </div>
            </XCard>
          </section>

          <!-- XCheckboxGroup -->
          <section id="section-checkboxgroup" class="scroll-mt-4">
            <XCard title="XCheckboxGroup 多选" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">direction</span>
                    <XSegmented
                      :model-value="checkboxGroupDirection"
                      :options="directionOptions"
                      size="small"
                      @update:model-value="value => (checkboxGroupDirection = value as 'horizontal' | 'vertical')"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">size</span>
                    <XSegmented
                      :model-value="checkboxGroupSize"
                      :options="sizeOptions"
                      size="small"
                      @update:model-value="value => (checkboxGroupSize = value as 'small' | 'medium' | 'large')"
                    />
                  </div>
                </div>
                <XCheckboxGroup
                  v-model="checkboxGroupValue"
                  :options="checkboxGroupOptions"
                  :direction="checkboxGroupDirection"
                  :size="checkboxGroupSize"
                  show-check-all
                />
                <XText type="secondary" size="sm">
                  当前值：{{ checkboxGroupValue.length ? checkboxGroupValue.join('、') : '未选' }}
                </XText>
              </div>
            </XCard>
          </section>

          <!-- XSegmented -->
          <section id="section-segmented" class="scroll-mt-4">
            <XCard title="XSegmented 分段选择器" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <XSegmented
                  v-model="viewValue"
                  :options="[{ value: 'card', label: '卡片', icon: 'LayoutGrid' }, { value: 'list', label: '列表', icon: 'List' }]"
                />
                <XSegmented
                  v-model="viewValue"
                  size="small"
                  :options="[{ value: 'card', label: '小尺寸' }, { value: 'list', label: '变体' }]"
                />
              </div>
            </XCard>
          </section>

          <!-- Switch -->
          <section id="section-switch" class="scroll-mt-4">
            <XCard title="Switch 开关" title-prefix>
              <div class="flex items-center gap-3 py-1">
                <label class="flex items-center gap-2 text-sm">
                  <XSwitch_ v-model="switchOn" /> 开关
                </label>
                <XText type="secondary" size="sm">当前值：{{ switchOn }}</XText>
              </div>
            </XCard>
          </section>

          <!-- XCopyText -->
          <section id="section-copytext" class="scroll-mt-4">
            <XCard title="XCopyText 点击复制" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <XCopyText text="SN202411230001" />
                <XCopyText text="13800000000" show-text="138****0000" />
              </div>
            </XCard>
          </section>

          <!-- XTitle -->
          <section id="section-title" class="scroll-mt-4">
            <XCard title="XTitle 标题" title-prefix>
              <div class="flex flex-col gap-3 py-1">
                <XTitle size="base" prefix>区块标题（base + prefix）</XTitle>
                <XTitle size="sm" type="error">异常告警（sm + error）</XTitle>
                <XTitle size="lg" prefix type="success">
                  正常运行（lg + success + tooltip）
                  <template #tooltip>设备已连续运行 30 天</template>
                </XTitle>
              </div>
            </XCard>
          </section>

          <!-- XText -->
          <section id="section-text" class="scroll-mt-4">
            <XCard title="XText 文本" title-prefix>
              <div class="flex flex-wrap items-center gap-4 py-1">
                <XText>默认文本</XText>
                <XText type="secondary">弱化文本</XText>
                <XText type="error" strong>错误文本</XText>
                <XText type="success">成功文本</XText>
                <XText size="sm" del>删除线文本</XText>
              </div>
            </XCard>
          </section>

          <!-- XLoading -->
          <section id="section-loading" class="scroll-mt-4">
            <XCard title="XLoading 加载" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">size</span>
                    <XSegmented
                      :model-value="loadingSize"
                      size="small"
                      :options="[{ value: 20, label: '小' }, { value: 28, label: '中' }, { value: 40, label: '大' }]"
                      @update:model-value="loadingSize = $event as number"
                    />
                  </div>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="loadingOn" class="scale-90" /> 显示
                  </label>
                </div>
                <div class="rounded-md border border-border p-4 flex items-center justify-center min-h-36 relative">
                  <XLoading :loading="loadingOn" :size="loadingSize" text="数据加载中…" />
                  <XText v-if="!loadingOn" type="secondary" size="sm">关闭「显示」看占位</XText>
                </div>
              </div>
            </XCard>
          </section>

          <!-- XEmpty -->
          <section id="section-empty" class="scroll-mt-4">
            <XCard title="XEmpty 空状态" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="emptyShowIcon" class="scale-90" /> showIcon
                  </label>
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="emptyShowDesc" class="scale-90" /> showDescription
                  </label>
                </div>
                <div class="rounded-md border border-border p-4 flex items-center justify-center min-h-36">
                  <XEmpty description="暂无设备数据" :show-icon="emptyShowIcon" :show-description="emptyShowDesc" />
                </div>
              </div>
            </XCard>
          </section>

          <!-- XImage -->
          <section id="section-image" class="scroll-mt-4">
            <XCard title="XImage 图片" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <div class="flex flex-wrap items-center gap-3">
                  <XImage v-for="(src, i) in demoImages" :key="src" :src="src" :width="96" :height="64" :alt="`示例图 ${i + 1}`" />
                  <XText type="secondary" size="sm">点击图片打开 XImagePreviewDialog</XText>
                </div>
              </div>
            </XCard>
          </section>

          <!-- XTooltip -->
          <section id="section-tooltip" class="scroll-mt-4">
            <XCard title="XTooltip 提示" title-prefix>
              <div class="flex flex-wrap items-center gap-4 py-1">
                <XTooltip side="top">
                  <template #trigger>
                    <XButton variant="outline">上方提示</XButton>
                  </template>
                  我是上方提示内容
                </XTooltip>
                <XTooltip side="right">
                  <template #trigger>
                    <XButton variant="outline" size="icon-lg" icon="CircleQuestionMark" />
                  </template>
                  我是右侧提示内容
                </XTooltip>
              </div>
            </XCard>
          </section>

          <!-- XDetail -->
          <section id="section-detail" class="scroll-mt-4">
            <XCard title="XDetail 详情" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="detailBordered" class="scale-90" /> bordered
                  </label>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">column</span>
                    <XSegmented
                      :model-value="detailColumn"
                      size="small"
                      :options="[{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 4, label: '4' }]"
                      @update:model-value="detailColumn = $event as number"
                    />
                  </div>
                </div>
                <Separator />
                <XDetail :fields="detailFields" :data="detailData" :column="detailColumn" :bordered="detailBordered" />
                <Separator />
                <XDetail :fields="detailSlotFields" :data="detailSlotData">
                  <template #slot-status="{ value }">
                    <XText :type="value === 1 ? 'success' : 'error'" strong>
                      {{ value === 1 ? '在线' : '离线' }}
                    </XText>
                  </template>
                </XDetail>
              </div>
            </XCard>
          </section>

          <!-- XDataTable -->
          <section id="section-table" class="scroll-mt-4">
            <XCard title="XDataTable 表格" title-prefix>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-muted/40 px-4 py-3">
                  <label class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XSwitch_ v-model="tableStriped" class="scale-90" /> striped
                  </label>
                  <XText type="secondary" size="sm">头部工具条：刷新 / 导出 / 列筛选，列筛选试试隐藏「状态」列</XText>
                </div>
                <XDataTable
                  title="设备列表"
                  :columns="tableColumns"
                  :data="tableData"
                  :loading="tableLoading"
                  :striped="tableStriped"
                  row-key="id"
                  table-export
                  @refresh="handleTableRefresh"
                  @export="() => toast.success('已交给外部处理导出')"
                >
                  <template #operator>
                    <XButton size="sm" variant="outline" icon="Plus" @click="() => toast.info('批量操作演示')">批量操作</XButton>
                  </template>
                </XDataTable>
              </div>
            </XCard>
          </section>

          <!-- XSearchForm -->
          <section id="section-searchform" class="scroll-mt-4">
            <XCard title="XSearchForm 查询区" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <XSearchForm
                  v-model="searchQuery"
                  :fields="searchFields"
                  :collapsed-count="4"
                  :columns="3"
                  @search="v => toast.success(`查询条件：${JSON.stringify(v)}`)"
                />
              </div>
            </XCard>
          </section>

          <!-- XForm -->
          <section id="section-form" class="scroll-mt-4">
            <XCard title="XForm 表单" title-prefix>
              <div class="flex flex-col gap-4 py-1">
                <XForm ref="formRef" v-model="formModel" :fields="formFields" :label-width="80" :columns="2" />
                <div class="flex justify-end">
                  <XButton size="sm" @click="handleFormSubmit">校验并提交</XButton>
                </div>
              </div>
            </XCard>
          </section>

          <!-- XDialog -->
          <section id="section-dialog" class="scroll-mt-4">
            <XCard title="XDialog 对话框" title-prefix>
              <div class="flex flex-wrap items-center gap-3 py-1">
                <XButton icon="SquarePen" @click="dialogOpen = true">打开对话框</XButton>
                <XText type="secondary" size="sm">含确认 loading（1.2s 模拟保存，期间不可关闭）</XText>
              </div>
            </XCard>
          </section>

          <!-- XDrawer -->
          <section id="section-drawer" class="scroll-mt-4">
            <XCard title="XDrawer 抽屉" title-prefix>
              <div class="flex flex-wrap items-center gap-3 py-1">
                <XButton variant="outline" icon="PanelRightOpen" @click="drawerOpen = true">打开抽屉</XButton>
                <XText type="secondary" size="sm">四方向可弹（side 属性），内嵌 XDetail</XText>
              </div>
            </XCard>
          </section>

          <!-- XImagePreviewDialog -->
          <section id="section-preview" class="scroll-mt-4">
            <XCard title="XImagePreviewDialog 图片预览" title-prefix>
              <div class="flex flex-wrap items-center gap-3 py-1">
                <XButton variant="ghost" icon="Images" @click="previewOpen = true">打开图片预览</XButton>
                <XText type="secondary" size="sm">多图切换 / 缩放 / 缩略图条</XText>
              </div>
            </XCard>
          </section>

          <!-- 底部说明（滚动区末尾） -->
          <p class="text-center text-xs text-muted-foreground pb-2">
            完整 API 与交互演示见 VitePress 文档站（<code class="rounded bg-muted px-1 py-0.5">pnpm run docs:dev</code>）
          </p>
        </div>
      </main>
    </div>

    <!-- 引入toaster组件，请保留这段代码 -->
    <Toaster position="top-center" closeButtonPosition="top-right" />

    <!-- 弹层实例：对话框 / 抽屉 / 图片预览 -->
    <XDialog
      v-model:open="dialogOpen"
      title="编辑设备"
      description="修改设备基础信息（演示确认 loading）"
      :confirm-loading="dialogSaving"
      @confirm="handleDialogConfirm"
    >
      <div class="space-y-3 text-sm">
        <p>对话框内容区，支持任意自定义内容。</p>
        <p class="text-muted-foreground">点击「确认」会触发 1.2s 模拟保存，期间弹窗不可关闭。</p>
      </div>
    </XDialog>

    <XDrawer v-model:open="drawerOpen" title="设备详情" description="右侧抽屉（演示）" :size="420">
      <div class="space-y-3 text-sm text-muted-foreground">
        <p>抽屉内容区，四方向可弹（side 属性），结构与 XDialog 一致。</p>
        <XDetail :fields="detailFields.slice(0, 2)" :data="detailData" bordered />
      </div>
    </XDrawer>

    <XImagePreviewDialog v-model:open="previewOpen" :images="demoImages" />
  </div>
</template>

<style scoped></style>

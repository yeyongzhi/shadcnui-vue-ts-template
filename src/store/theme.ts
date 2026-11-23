import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useColorMode } from '@vueuse/core'

/** 颜色模式 */
export type ColorMode = 'light' | 'dark' | 'auto'
/** 主题色预设 ID */
export type ThemePresetId = string

/** 圆角档位：值为基础圆角（rem），派生 rounded-sm/md/lg/xl 全套 */
export const RADIUS_PRESETS = [
  { value: 0, label: '直角' },
  { value: 0.25, label: '小' },
  { value: 0.5, label: '中' },
  { value: 0.625, label: '大' },
  { value: 1, label: '全圆' },
] as const

export type RadiusValue = (typeof RADIUS_PRESETS)[number]['value']
/** 默认圆角档位：大（0.625rem，即 shadcn 默认 10px） */
const DEFAULT_RADIUS: RadiusValue = 0.625

/** 主题预设：基于 theme-color-palettes 稳定 ID，hex 为基准色 */
export interface ThemePreset {
  id: ThemePresetId
  label: string
  hex: string
  /** 该色底上的文字色（由 palettes.json onColor 计算得出） */
  onColor: string
}

/** 经典七色 */
const CLASSIC_PRESETS: ThemePreset[] = [
  { id: 'classic-red', label: '红', hex: '#EF4444', onColor: '#000000' },
  { id: 'classic-orange', label: '橙', hex: '#F97316', onColor: '#000000' },
  { id: 'classic-yellow', label: '黄', hex: '#EAB308', onColor: '#000000' },
  { id: 'classic-green', label: '绿', hex: '#22C55E', onColor: '#000000' },
  { id: 'classic-blue', label: '蓝', hex: '#3B82F6', onColor: '#000000' },
  { id: 'classic-indigo', label: '靛', hex: '#6366F1', onColor: '#000000' },
  { id: 'classic-violet', label: '紫', hex: '#8B5CF6', onColor: '#000000' },
]

/** 莫兰迪色系 */
const MORANDI_PRESETS: ThemePreset[] = [
  { id: 'morandi-dusty-rose', label: '灰玫瑰', hex: '#B58B8D', onColor: '#000000' },
  { id: 'morandi-clay', label: '陶土', hex: '#B58A78', onColor: '#000000' },
  { id: 'morandi-sage', label: '鼠尾草', hex: '#A3AD9B', onColor: '#000000' },
  { id: 'morandi-eucalyptus', label: '桉叶灰绿', hex: '#8FA89B', onColor: '#000000' },
  { id: 'morandi-mist-blue', label: '雾霾蓝', hex: '#8FA3B0', onColor: '#000000' },
  { id: 'morandi-lavender', label: '灰薰衣草', hex: '#A49BB0', onColor: '#000000' },
]

/** 持久化存储 key（整包单 key，参考 FrontCore app-theme-config 模式） */
const STORAGE_KEY = 'app-theme-config'

/** 默认模式：light */
const DEFAULT_MODE: ColorMode = 'light'
/** 默认预设：经典蓝（未指定默认色的新模块使用 classic-blue） */
const DEFAULT_PRESET_ID: ThemePresetId = 'classic-blue'

/** 持久化结构 */
interface ThemeConfig {
  mode?: ColorMode
  presetId?: ThemePresetId
  radius?: number
}

/** 从 localStorage 读取配置，默认值兜底（兼容字段缺失 / JSON 损坏 / 无效 ID） */
function loadConfig(): { mode: ColorMode, presetId: ThemePresetId, radius: RadiusValue } {
  const fallback = { mode: DEFAULT_MODE, presetId: DEFAULT_PRESET_ID, radius: DEFAULT_RADIUS }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as ThemeConfig
    const allIds = [...CLASSIC_PRESETS, ...MORANDI_PRESETS].map(p => p.id)
    return {
      mode: parsed.mode === 'light' || parsed.mode === 'dark' || parsed.mode === 'auto' ? parsed.mode : fallback.mode,
      presetId: allIds.includes(parsed.presetId ?? '') ? parsed.presetId! : fallback.presetId,
      radius: RADIUS_PRESETS.some(p => p.value === parsed.radius) ? (parsed.radius as RadiusValue) : fallback.radius,
    }
  }
  catch {
    return fallback
  }
}

/**
 * hex → oklch 字符串（如 "#3B82F6" → "oklch(0.62 0.21 259)"）。
 * 借道 canvas 将 hex 转成 sRGB 分量后做 OKLab 变换。
 */
function hexToOklch(hex: string): { l: number, c: number, h: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255

  // sRGB → linear
  const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  // linear sRGB → OKLab
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  const l = Math.cbrt(l_)
  const m = Math.cbrt(m_)
  const s = Math.cbrt(s_)

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  const C = Math.sqrt(A * A + B * B)
  const H = (Math.atan2(B, A) * 180) / Math.PI

  return { l: L, c: C, h: (H + 360) % 360 }
}

/** 格式化 oklch 输出（保留 3 位小数） */
function formatOklch({ l, c, h }: { l: number, c: number, h: number }): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`
}

/** OKLCH → hex（用于把派生后的主色还原成 hex 以计算 WCAG 对比度） */
function oklchToHex({ l, c, h }: { l: number, c: number, h: number }): string {
  const hr = (h * Math.PI) / 180
  const A = c * Math.cos(hr)
  const B = c * Math.sin(hr)

  const l_ = l + 0.3963377774 * A + 0.2158037573 * B
  const m_ = l - 0.1055613458 * A - 0.0638541728 * B
  const s_ = l - 0.0894841775 * A - 1.2914855480 * B
  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3

  let r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  let b = -0.0041960863 * L - 0.7034186147 * M + 1.7076147010 * S

  const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
  const clamp = (v: number) => Math.round(Math.min(Math.max(toGamma(v), 0), 1) * 255)
  r = clamp(r)
  g = clamp(g)
  b = clamp(b)
  return `#${[r, g, b].map(v => v!.toString(16).padStart(2, '0')).join('')}`
}

/**
 * 计算 hex 颜色与黑/白文字的 WCAG 对比度，返回对比度更高的那个。
 * primary-foreground 用：白字对比度 >= 3.0 时优先白字（shadcn 默认按钮白字惯例），
 * 否则用黑字。阈值 3.0 对应 WCAG 大号文字/图形的最低要求；实心按钮内
 * 的按钮文字按常规字号渲染时通常远高于此值，如个别浅色预设不足，
 * 应调低该预设的明度而不是改阈值。
 */
function pickOnColor(hex: string, whiteThreshold = 3.0): string {
  const contrastWhite = wcagContrast(hex, '#FFFFFF')
  return contrastWhite >= whiteThreshold ? '#FFFFFF' : '#000000'
}

/** WCAG 相对亮度对比度 */
function wcagContrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const bl = Number.parseInt(hex.slice(5, 7), 16) / 255
    const lin = [r, g, bl].map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1! + 0.05) / (l2! + 0.05)
}

/**
 * 生成运行时主题样式表内容。
 * 基准色不变，按明暗模式分别派生：
 * - 亮色：primary 用基准色明度（min 0.55 保证与白底对比），hover 减 8% 明度
 * - 暗色：primary 提亮 12%（保证与暗底对比），hover 增 6%
 * primary-foreground 按最终主色的 WCAG 对比度自动选白 / 黑。
 */
function buildThemeStyle(mode: 'light' | 'dark', preset: ThemePreset): string {
  const base = hexToOklch(preset.hex)
  const root = mode === 'light' ? ':root' : '.dark'
  const L = mode === 'light' ? Math.max(base.l, 0.55) : Math.min(base.l + 0.12, 0.92)
  const LHover = mode === 'light' ? L - 0.08 : L + 0.06

  // 最终主色的近似 hex（亮色用基准色，暗色用提亮后的近似还原），据此选前景文字色
  const effectiveHex = mode === 'light' ? preset.hex : oklchToHex({ ...base, l: L })
  const primaryFg = pickOnColor(effectiveHex)

  return [
    `${root} {`,
    `  --primary: ${formatOklch({ l: L, c: base.c, h: base.h })};`,
    `  --primary-foreground: ${primaryFg};`,
    `  --ring: ${formatOklch({ l: L, c: base.c, h: base.h })};`,
    `  --primary-hover: ${formatOklch({ l: LHover, c: base.c, h: base.h })};`,
    '}',
  ].join('\n')
}

const useThemeStore = defineStore('theme', () => {
  const initial = loadConfig()

  // —— 状态 ——
  /**
   * 明暗模式（VueUse useColorMode：写 class="dark" + 持久化 vueuse-color-scheme）。
   * emitAuto: true 让 mode.value 在 auto 模式下返回 'auto' 而不是解析后的 light/dark，
   * 否则 XSegmented 等绑定组件拿不到「系统」选中态（点了看起来没反应）。
   */
  const mode = useColorMode<ColorMode>({
    storageKey: 'vueuse-color-scheme',
    initialValue: initial.mode,
    emitAuto: true,
  })
  /** 当前主题色预设 ID */
  const presetId = ref<ThemePresetId>(initial.presetId)
  /** 全局基础圆角（rem）：驱动 rounded-sm/md/lg/xl 全套派生 */
  const radius = ref<RadiusValue>(initial.radius)

  // —— 派生 ——
  const preset = () => {
    const all = [...CLASSIC_PRESETS, ...MORANDI_PRESETS]
    return all.find(p => p.id === presetId.value) ?? all.find(p => p.id === DEFAULT_PRESET_ID)!
  }
  const themePresets = ref({ '经典': CLASSIC_PRESETS, '莫兰迪': MORANDI_PRESETS })
  /** 当前生效的预设（派生，供 UI 展示当前色名） */
  const currentPreset = computed(() => preset())

  // —— 副作用集中声明（参考 FrontCore watchEffect 模式）——
  // 1. 整包持久化到单一 localStorage key
  watchEffect(() => {
    const config: ThemeConfig = { mode: mode.value, presetId: presetId.value, radius: radius.value }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  })

  // 2. 主题色 CSS 变量运行时注入（亮 / 暗各一份，跟随模式自动切换）
  watchEffect(() => {
    const id = 'x-theme-preset-style'
    let styleEl = document.getElementById(id) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = id
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = [
      buildThemeStyle('light', preset()),
      buildThemeStyle('dark', preset()),
    ].join('\n')
  })

  // 3. 全局圆角：改 :root 的 --radius，rounded-sm/md/lg/xl 全套随 @theme inline 派生自动生效
  watchEffect(() => {
    document.documentElement.style.setProperty('--radius', `${radius.value}rem`)
  })

  // —— Actions ——
  const setMode = (value: ColorMode) => {
    mode.value = value
  }
  const setPreset = (id: ThemePresetId) => {
    presetId.value = id
  }
  const setRadius = (value: RadiusValue) => {
    radius.value = value
  }

  return {
    mode,
    presetId,
    themePresets,
    currentPreset,
    radius,
    setMode,
    setPreset,
    setRadius,
  }
})

export default useThemeStore

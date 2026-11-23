# 主题配置

主题系统由 `src/store/theme.ts` 实现，包含**明暗模式**与**主题色预设**两部分。

## 使用

```vue
<script setup lang="ts">
import useThemeStore from '@/store/theme'

const themeStore = useThemeStore()
</script>

<template>
  <!-- 切换明暗模式 -->
  <button @click="themeStore.setMode('dark')">暗色</button>

  <!-- 切换主题色 -->
  <button @click="themeStore.setPreset('classic-green')">绿色</button>
</template>
```

## 明暗模式

基于 VueUse `useColorMode`：

- `light` / `dark` / `auto` 三种模式，写 `<html>` 的 `dark` class
- 与 Tailwind 的 `dark:` 变体及 shadcn CSS 变量（`style.css` 中 `.dark` 块）联动
- 独立持久化到 localStorage key `vueuse-color-scheme`

## 主题色预设

预设分为两组（稳定 ID 来自 theme-color-palettes 规范）：

| 分组 | 预设 |
|------|------|
| 经典 | 红 `#EF4444` / 橙 `#F97316` / 黄 `#EAB308` / 绿 `#22C55E` / 蓝 `#3B82F6`（默认）/ 靛 `#6366F1` / 紫 `#8B5CF6` |
| 莫兰迪 | 灰玫瑰 / 陶土 / 鼠尾草 / 桉叶灰绿 / 雾霾蓝 / 灰薰衣草 |

### 实现机制

1. **基准色换算**：预设 HEX 通过 OKLab 变换转成 OKLCH
2. **明暗派生**：亮色模式主色明度下限 0.55（保证按钮白字对比度）；暗色模式提亮 0.12（保证与暗底对比）；hover 色为明度派生
3. **运行时注入**：`watchEffect` 把 `:root` 与 `.dark` 两套 `--primary` / `--primary-foreground` / `--ring` / `--primary-hover` 写入 `<style id="x-theme-preset-style">`
4. **整包持久化**：`{ mode, presetId }` 存入 localStorage key `app-theme-config`，读取时做默认值兜底与无效 ID 回退

基准色本身不变，派生只发生在 UI 令牌（主色 / 前景 / 焦点环）上；错误、警告等状态语义色不受预设影响。

## 扩展预设

在 `src/store/theme.ts` 的 `CLASSIC_PRESETS` / `MORANDI_PRESETS` 数组中按 `{ id, label, hex, onColor }` 追加即可，`id` 必须全局唯一（无效 ID 会被持久化读取逻辑回退到默认值）。

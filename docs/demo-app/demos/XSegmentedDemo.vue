<script setup lang="ts">
import { ref } from 'vue'
import XSegmented from '@/components/x/XSegmented'
import useThemeStore from '@/store/theme'

const themeStore = useThemeStore()
const view = ref<'card' | 'list'>('card')

const viewOptions = [
  { value: 'card', label: '卡片', icon: 'LayoutGrid' },
  { value: 'list', label: '列表', icon: 'List' },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">视图</span>
      <XSegmented v-model="view" :options="viewOptions" />
      <XSegmented v-model="view" :options="viewOptions" size="small" block class="max-w-60" />
    </div>
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">明暗</span>
      <XSegmented
        :model-value="themeStore.mode"
        :options="[
          { value: 'light', label: '亮色', icon: 'Sun' },
          { value: 'dark', label: '暗色', icon: 'Moon' },
          { value: 'auto', label: '系统', icon: 'Monitor' },
        ]"
        @update:model-value="themeStore.setMode($event as any)"
      />
    </div>
  </div>
</template>

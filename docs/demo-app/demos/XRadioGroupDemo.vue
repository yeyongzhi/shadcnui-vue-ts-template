<script setup lang="ts">
import { ref } from 'vue'
import XRadioGroup from '@/components/x/XRadioGroup'

const period = ref<'day' | 'week' | 'month'>('day')
const options = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
  { value: 'quarter', label: '按季（禁用）', disabled: true },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">横向</span>
      <XRadioGroup v-model="period" :options="options" />
    </div>
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">纵向小号</span>
      <XRadioGroup v-model="period" :options="options" direction="vertical" size="small" />
    </div>
  </div>
</template>
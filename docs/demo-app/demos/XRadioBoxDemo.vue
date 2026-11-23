<script setup lang="ts">
import { ref } from 'vue'
import XRadioBox from '@/components/x/XRadioBox'

const level = ref<'all' | 'high'>('all')
const options = [
  { value: 'all', label: '全部' },
  { value: 'high', label: '仅高风险' },
]
</script>

<template>
  <div class="p-4 flex items-center gap-3">
    <span class="text-sm text-muted-foreground">筛选</span>
    <XRadioBox v-model="level" :options="options" />
  </div>
</template>

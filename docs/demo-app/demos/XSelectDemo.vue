<script setup lang="ts">
import { ref } from 'vue'
import XSelect from '@/components/x/XSelect'

const status = ref<number | null>(1)
const options = [
  { value: 1, label: '在线' },
  { value: 0, label: '离线' },
  { value: 2, label: '维护中', disabled: true },
]
</script>

<template>
  <div class="p-4 flex items-center gap-3">
    <span class="text-sm text-muted-foreground">状态</span>
    <XSelect v-model="status" :options="options" class="w-48" />
    <span class="text-xs text-muted-foreground">当前值：{{ JSON.stringify(status) }}</span>
  </div>
</template>

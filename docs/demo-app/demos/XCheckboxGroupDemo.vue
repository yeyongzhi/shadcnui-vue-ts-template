<script setup lang="ts">
import { ref } from 'vue'
import XCheckboxGroup from '@/components/x/XCheckboxGroup'

const channels = ref<(string | number)[]>(['email'])
const options = [
  { value: 'email', label: '邮件' },
  { value: 'sms', label: '短信' },
  { value: 'inbox', label: '站内信' },
  { value: 'call', label: '电话（禁用）', disabled: true },
]
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">横向</span>
      <XCheckboxGroup v-model="channels" :options="options" show-check-all />
    </div>
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted-foreground w-16">纵向小号</span>
      <XCheckboxGroup v-model="channels" :options="options" direction="vertical" size="small" />
    </div>
  </div>
</template>
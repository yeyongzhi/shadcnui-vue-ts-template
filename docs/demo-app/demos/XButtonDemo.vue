<script setup lang="ts">
import { ref } from 'vue'
import XButton from '@/components/x/XButton'

const loading = ref(false)
const toggle = () => {
  loading.value = !loading.value
}
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <XButton>默认</XButton>
      <XButton variant="outline" icon="Plus">新建</XButton>
      <XButton variant="secondary" icon="Download">下载</XButton>
      <XButton variant="destructive" icon="Trash2">删除</XButton>
      <XButton variant="ghost" icon="Settings">设置</XButton>
      <XButton disabled>禁用</XButton>
    </div>
    <div class="flex items-center gap-2">
      <XButton size="sm">小按钮</XButton>
      <XButton size="lg">大按钮</XButton>
      <XButton :loading="loading" @click="toggle">
        {{ loading ? '点击取消加载' : '点击开始加载' }}
      </XButton>
    </div>
  </div>
</template>

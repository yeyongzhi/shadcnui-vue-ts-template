<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import useAppStore from '@/store/app';
import { Button } from '@/components/ui/button'

const appStore = useAppStore();

</script>

<template>
  <div class="w-full h-full">
    <div class="h-full flex justify-center items-center gap-4">
      <Button @click="appStore.handleModeChange('light')">
        切换亮色模式
      </Button>
      <Button @click="appStore.handleModeChange('dark')">
        切换暗色模式
      </Button>
      <Button @click="appStore.handleModeChange('auto')">
        切换系统模式
      </Button>
    </div>
    <Toaster position="top-center" closeButtonPosition="top-right" />
  </div>
</template>

<style scoped></style>

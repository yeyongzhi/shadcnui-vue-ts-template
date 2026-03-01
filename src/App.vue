<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import useAppStore from '@/store/app';
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from './components/ui/input';

const appStore = useAppStore();

</script>

<template>
  <div class="w-full h-full flex flex-col gap-10 justify-center items-center">
    <p class="text-2xl font-bold">这是一个基于shadcn-vue的vue-ts项目模板</p>
    <p>主题色已经被改成 蓝色</p>
    <Switch />
    <Input placeholder="请输入" class="w-80" />
    <div class="flex justify-center items-center gap-4">
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
    <!-- 引入toaster组件，请保留这段代码 -->
    <Toaster position="top-center" closeButtonPosition="top-right" />
  </div>
</template>

<style scoped></style>

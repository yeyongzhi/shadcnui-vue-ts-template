<script setup lang="ts">
/**
 * 演示 SPA 入口：
 * - ?component=Xxx 渲染单个组件演示（供文档站 iframe 内嵌）
 * - 无参数时渲染全部演示列表（可直接访问 demos/index.html 浏览）
 * - postMessage 接收文档站暗色模式并同步
 */
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { demoRegistry } from './registry'

const url = new URL(window.location.href)
const target = url.searchParams.get('component') ?? ''

const entry = computed(() => (target ? demoRegistry[target] ?? null : null))
const unknown = computed(() => !!target && !demoRegistry[target])

const dark = ref(false)
const applyDark = (value: boolean) => {
  dark.value = value
  document.documentElement.classList.toggle('dark', value)
}

const handleMessage = (event: MessageEvent) => {
  const data = event.data
  if (!data || typeof data !== 'object') return
  if (data.type === 'shadcnui-template-demo-theme') {
    applyDark(!!data.dark)
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  // 通知宿主：演示已就绪 + 内容高度
  const notify = () => {
    window.parent?.postMessage(
      { type: 'shadcnui-template-demo-ready', height: document.documentElement.scrollHeight },
      '*',
    )
  }
  notify()
  // 内容尺寸变化时更新宿主 iframe 高度
  const observer = new ResizeObserver(notify)
  observer.observe(document.body)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="demo-app min-h-full bg-background text-foreground">
    <!-- 单组件演示模式 -->
    <template v-if="entry">
      <component :is="entry.component" />
    </template>

    <!-- 未知组件 -->
    <div v-else-if="unknown" class="p-6 text-sm text-muted-foreground">
      未找到组件「{{ target }}」的演示，请在 docs/demo-app/registry.ts 中注册。
    </div>

    <!-- 全量浏览模式 -->
    <template v-else>
      <div class="mx-auto max-w-3xl p-6 flex flex-col gap-8">
        <h1 class="text-xl font-bold">组件演示</h1>
        <section v-for="(demo, key) in demoRegistry" :key="key" class="flex flex-col gap-2">
          <h2 class="text-sm font-semibold text-muted-foreground">{{ demo.label }}</h2>
          <div class="rounded-lg border border-border p-4">
            <component :is="demo.component" />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

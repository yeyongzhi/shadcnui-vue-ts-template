<script setup lang="ts">
/**
 * 组件文档内嵌演示容器。
 * 通过 iframe 加载 docs/public/demos（demo SPA 构建产物），postMessage 双向同步暗色模式。
 * 演示源码在 docs/demo-app/，构建命令 pnpm run docs:demos（docs:build 已包含）。
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  /** 演示的组件名（对应 demo-app/registry.ts 注册的 key） */
  name: string
  /** 演示高度（px） */
  height?: number
}>()

const { isDark } = useData()
const frame = ref<HTMLIFrameElement | null>(null)
const frameHeight = ref(props.height ?? 220)
const loaded = ref(false)

const postTheme = () => {
  frame.value?.contentWindow?.postMessage(
    { type: 'shadcnui-template-demo-theme', dark: isDark.value },
    '*',
  )
}

const handleMessage = (event: MessageEvent) => {
  const data = event.data
  if (!data || typeof data !== 'object') return
  if (data.type === 'shadcnui-template-demo-ready') {
    loaded.value = true
    postTheme()
    if (typeof data.height === 'number' && !props.height) {
      frameHeight.value = Math.max(data.height, 120)
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
  postTheme()
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})

watch(isDark, postTheme)
</script>

<template>
  <div class="component-demo">
    <div class="component-demo-stage">
      <iframe
        ref="frame"
        class="component-demo-frame"
        :style="{ height: `${frameHeight}px`, opacity: loaded ? 1 : 0 }"
        :src="`/demos/index.html?component=${encodeURIComponent(name)}`"
        title="组件演示"
        @load="postTheme"
      />
      <div v-if="!loaded" class="component-demo-loading">演示加载中…</div>
    </div>
    <details class="component-demo-tip">
      <summary>如何运行演示</summary>
      <p>
        本演示构建自 <code>docs/demo-app/</code>，直接复用项目源码组件。本地运行
        <code>pnpm run docs:demos</code> 构建演示，再 <code>pnpm run docs:dev</code> 打开文档站。
      </p>
    </details>
  </div>
</template>

<style scoped>
.component-demo {
  margin: 16px 0 24px;
}

.component-demo-stage {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.component-demo-frame {
  display: block;
  width: 100%;
  border: 0;
  transition: opacity 0.2s ease;
  background: transparent;
}

.component-demo-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.component-demo-tip {
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.component-demo-tip summary {
  cursor: pointer;
}

.component-demo-tip p {
  margin-top: 6px;
  line-height: 1.7;
}
</style>

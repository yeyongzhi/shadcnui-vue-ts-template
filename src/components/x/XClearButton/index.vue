<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import XIcon from '@/components/x/XIcon'

const props = defineProps<{
  label: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <span
    role="button"
    tabindex="0"
    :aria-label="label"
    :class="cn(
      'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground opacity-70 transition-colors hover:bg-muted hover:text-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      props.class,
    )"
    @click.stop="emit('clear')"
    @keydown.enter.stop.prevent="emit('clear')"
    @keydown.space.stop.prevent="emit('clear')"
  >
    <XIcon name="X" :size="14" />
  </span>
</template>

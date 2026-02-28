import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import toast from '@/plugins/message'

type ColorMode = 'light' | 'dark' | 'auto'

const DEFAULT_MODE: ColorMode = 'light'

const useAppStore = defineStore('app', () => {
    const mode = useColorMode()
    const themeOptions = ref([
        {
            label: 'Light',
            value: 'light',
        },
        {
            label: 'Dark',
            value: 'dark',
        },
        {
            label: 'System',
            value: 'auto',
        }
    ])
    const handleModeChange = (value: ColorMode) => {
        toast.success(`已切换到${value === 'auto' ? '系统' : value}模式`)
        mode.value = value
    }

    onMounted(() => {
        mode.value = DEFAULT_MODE
    })

    return {
        mode,
        themeOptions,
        handleModeChange,
    }
})

export default useAppStore

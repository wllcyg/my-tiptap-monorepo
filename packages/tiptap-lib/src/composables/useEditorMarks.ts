// packages/tiptap-lib/src/composables/useToolbarState.ts
import { computed } from 'vue'
import { useTiptapEditor } from './useTiptapEditor'

/**
 * 极简工具栏状态：只提供 撤销 / 重做 是否可用
 * 后续需要更多功能再逐步扩展即可
 */
export function useToolbarState() {
    const editor = useTiptapEditor()
    // 是否可以撤销
    const canUndo = computed(() => editor.value?.can().undo() ?? false)

    // 是否可以重做
    const canRedo = computed(() => editor.value?.can().redo() ?? false)
    return {
        canUndo,
        canRedo,
        editor,
    }
}
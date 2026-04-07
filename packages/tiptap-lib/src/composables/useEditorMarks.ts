// packages/tiptap-lib/src/composables/useToolbarState.ts
import { computed } from 'vue'
import { useTiptapEditor } from './useTiptapEditor'

/**
 * 极简工具栏状态：只提供 撤销 / 重做 是否可用
 * 后续需要更多功能再逐步扩展即可
 */
export function useToolbarState() {
    const editor = useTiptapEditor()
    // 是否可以撤销 — 使用 any 断言兼容不同版本的 tiptap types
    const canUndo = computed(() => {
        const inst = editor.value
        if (!inst) return false
        // can() 的具体类型在不同版本中可能不一致，使用 any 做最小修复
        return ((inst.can() as any)?.undo?.() ?? false) as boolean
    })

    // 是否可以重做
    const canRedo = computed(() => {
        const inst = editor.value
        if (!inst) return false
        return ((inst.can() as any)?.redo?.() ?? false) as boolean
    })
    return {
        canUndo,
        canRedo,
        editor,
    }
}
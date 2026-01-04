import { computed, inject, Ref, unref } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { useTiptapEditor } from './useTiptapEditor'

interface UseUndoRedoOptions {
    /**
     * 要执行的动作：撤销还是重做
     */
    action: 'undo' | 'redo'

    /**
     * 是否在不可用时（如历史记录为空）隐藏UI
     * @default false
     */
    hideWhenUnavailable?: boolean

    /**
     * 执行动作后的回调
     */
    onExecuted?: () => void

    /**
     * 可选：手动传入编辑器实例。如果不传，默认使用 useTiptapEditor() 获取
     */
    editor?: Ref<Editor | null> | Editor | null
}

export function useUndoRedo(options: UseUndoRedoOptions) {
    const { action, hideWhenUnavailable = false, onExecuted } = options

    // 如果没传 editor，就尝试注入
    let editor: Ref<Editor | null | undefined> | Editor | null | undefined

    if (options.editor !== undefined) {
        editor = options.editor
    } else {
        editor = useTiptapEditor() as Ref<Editor | null>
    }

    /**
     * 辅助函数：获取 unref 后的 editor 实例
     */
    const getEditor = () => unref(editor)

    /**
     * 是否可以执行该动作
     */
    const canExecute = computed(() => {
        const instance = getEditor()
        if (!instance) return false

        return action === 'undo'
            ? instance.can().undo()
            : instance.can().redo()
    })

    /**
     * 最终是否可见
     * 如果 hideWhenUnavailable 为 true 且当前不可执行，则隐藏
     */
    const isVisible = computed(() => {
        if (!hideWhenUnavailable) return true
        return canExecute.value
    })

    /**
     * 执行动作的处理函数
     */
    const handleAction = () => {
        const instance = getEditor()
        if (!instance) return

        if (action === 'undo') {
            instance.chain().focus().undo().run()
        } else {
            instance.chain().focus().redo().run()
        }

        onExecuted?.()
    }

    return {
        canExecute,
        isVisible,
        handleAction
    }
}

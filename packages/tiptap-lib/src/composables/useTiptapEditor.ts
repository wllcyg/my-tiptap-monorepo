// packages/tiptap-lib/src/composables/useTiptapEditor.ts
import { inject, provide, readonly, Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const TiptapEditorSymbol = Symbol('tiptap-editor')

// 新增：定义注入的类型
type TiptapEditorInjection = Ref<Readonly<Editor | null>>

export function provideTiptapEditor(editorRef: Ref<Editor | undefined>) {
    // 将 undefined 转为 null，并提供只读版本
    const readonlyRef = readonly(editorRef as unknown as Ref<Editor | null>)
    provide(TiptapEditorSymbol, readonlyRef)
}

export function useTiptapEditor(): TiptapEditorInjection {
    const editor = inject<TiptapEditorInjection>(TiptapEditorSymbol)

    if (!editor) {
        throw new Error(
            '[tiptap-lib] useTiptapEditor() 必须在 TiptapEditor 组件或其后代组件中使用'
        )
    }

    return editor
}
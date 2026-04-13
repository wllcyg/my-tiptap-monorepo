import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTiptapEditor } from './useTiptapEditor'

export function useActive(name: string, options?: any) {
  const editorRef = useTiptapEditor()
  const isActive = ref(false)

  const update = () => {
    const editor = editorRef.value
    if (!editor) return
    
    if (name === 'heading' || name === 'bulletList' || name === 'orderedList' || name === 'blockquote' || name === 'codeBlock' || name === 'highlight') {
      isActive.value = editor.isActive(name, options)
    } else {
      isActive.value = editor.isActive(name)
    }
  }

  onMounted(() => {
    const editor = editorRef.value
    if (!editor) return
    
    // 监听编辑器的 transaction 和 selectionUpdate 事件
    editor.on('transaction', update)
    editor.on('selectionUpdate', update)
    editor.on('update', update)
    
    // 初始化调用一次
    update()
  })

  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (!editor) return
    
    editor.off('transaction', update)
    editor.off('selectionUpdate', update)
    editor.off('update', update)
  })

  // 监听 editorRef 的变化，确保编辑器初始化后能正确更新状态
  watch(editorRef, (newEditor) => {
    if (newEditor) {
      newEditor.on('transaction', update)
      newEditor.on('selectionUpdate', update)
      newEditor.on('update', update)
      update()
    }
  }, { immediate: true })

  return isActive
}

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTiptapEditor } from './useTiptapEditor'

export function useActive(name: string, options?: any) {
  const { value: editor } = useTiptapEditor()
  const isActive = ref(false)

  const update = () => {
    if (!editor) return
    if (name === 'heading' || name === 'bulletList' || name === 'orderedList' || name === 'blockquote' || name === 'codeBlock') {
      isActive.value = editor.isActive(name, options)
    } else {
      isActive.value = editor.isActive(name)
    }
  }

  onMounted(() => {
    if (!editor) return
    editor.on('transaction', update)
    // 初始化调用一次
    update()
  })

  onBeforeUnmount(() => {
    if (!editor) return
    editor.off('transaction', update)
  })

  return isActive
}

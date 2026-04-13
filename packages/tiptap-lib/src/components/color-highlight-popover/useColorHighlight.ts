import { ref, computed, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import { useTiptapEditor } from '../../composables/useTiptapEditor'
import { ColorFill } from "@vicons/ionicons5"

export interface HighlightHandlerOptions {
  color: string;
  label?: string;
}

export interface UseColorHighlightProps {
  /** 应用高亮后的回调 */
  onApplied?: (data: HighlightHandlerOptions) => void;
  /** 当不可用时是否隐藏（影响 isVisible） */
  hideWhenUnavailable?: boolean;
}

/**
 * Tiptap 高亮功能 Composable (100% 对标 React 版本)
 */
export function useColorHighlight(props: UseColorHighlightProps = {}) {
  const editorRef = useTiptapEditor()
  const editor = computed(() => editorRef.value)
  
  const currentColor = ref<string | null>(null)
  const isActive = computed(() => !!currentColor.value)
  const canColorHighlight = ref(false)
  
  // 对标 React 版的额外属性
  const isVisible = ref(true)
  const label = ref('Highlight')
  const shortcutKeys = ref('') // Tiptap 默认高亮无全局快捷键
  const Icon = markRaw(ColorFill)

  const updateState = () => {
    if (!editor.value) return
    
    // 1. 检查高亮状态
    const active = editor.value.isActive('highlight')
    if (active) {
      const attrs = editor.value.getAttributes('highlight')
      currentColor.value = attrs.color || '#fff3bf'
    } else {
      currentColor.value = null
    }

    // 2. 检查可用性
    canColorHighlight.value = editor.value.can().setHighlight()
    
    // 3. 检查可见性 (受编辑状态和 hideWhenUnavailable 影响)
    if (props.hideWhenUnavailable) {
      isVisible.value = editor.value.isEditable && canColorHighlight.value
    } else {
      isVisible.value = editor.value.isEditable
    }
  }

  const bindEvents = (instance: any) => {
    if (!instance) return
    instance.on('transaction', updateState)
    instance.on('selectionUpdate', updateState)
    updateState()
  }

  const unbindEvents = (instance: any) => {
    if (!instance) return
    instance.off('transaction', updateState)
    instance.off('selectionUpdate', updateState)
  }

  onMounted(() => {
    if (editor.value) bindEvents(editor.value)
  })

  onBeforeUnmount(() => {
    unbindEvents(editor.value)
  })

  watch(editor, (newVal, oldVal) => {
    if (oldVal) unbindEvents(oldVal)
    if (newVal) bindEvents(newVal)
  }, { immediate: true })

  /** 应用高亮 */
  const setHighlight = (color: string) => {
    if (!editor.value) return
    editor.value.chain().focus().setHighlight({ color }).run()
    
    // 触发回调
    props.onApplied?.({ color })
  }

  /** 移除高亮 */
  const removeHighlight = () => {
    editor.value?.chain().focus().unsetHighlight().run()
    props.onApplied?.({ color: '' })
  }

  return {
    editor,
    currentColor,
    isActive,
    canColorHighlight,
    isVisible,
    label,
    shortcutKeys,
    Icon,
    setHighlight,
    removeHighlight,
    handleColorHighlight: setHighlight,
    handleRemoveHighlight: removeHighlight
  }
}

import { ref, computed, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import { useTiptapEditor } from '../../composables/useTiptapEditor'
import { ColorPalette } from "@vicons/ionicons5"
import type { Editor } from '@tiptap/core'

export interface ColorTextHandlerOptions {
  color: string;
  label?: string;
}

export interface UseColorTextProps {
  /** 应用颜色后的回调 */
  onApplied?: (data: ColorTextHandlerOptions) => void;
  /** 当不可用时是否隐藏（影响 isVisible） */
  hideWhenUnavailable?: boolean;
}

/**
 * 1:1 复刻 React 版的工具函数：检查是否可以设置文字颜色
 */
export const canColorText = (editor: any): boolean => {
  return !!editor?.can().chain().focus().setColor('#000').run()
}

/**
 * 1:1 复刻 React 版的工具函数：检查特定文字颜色是否激活
 */
export const isColorTextActive = (editor: any, color: string): boolean => {
  if (!editor) return false
  return editor.isActive('textStyle', { color })
}

/**
 * Tiptap 文字颜色功能 Composable (1:1 对标 React 版本)
 */
export function useColorText(props: UseColorTextProps = {}) {
  const editorRef = useTiptapEditor()
  const editor = computed(() => editorRef.value)
  
  const currentColor = ref<string | null>(null)
  const isActive = computed(() => !!currentColor.value)
  const canColorTextState = ref(false)
  
  // 对标 React 版属性
  const isVisible = ref(true)
  const label = ref('Text Color')
  const shortcutKeys = ref('Mod-Shift-T') // 对标 React 版快捷键说明
  const Icon = markRaw(ColorPalette)

  const updateState = () => {
    if (!editor.value) return
    
    // 1. 检查当前文字颜色
    const attrs = editor.value.getAttributes('textStyle')
    currentColor.value = attrs.color || null

    // 2. 检查可用性
    canColorTextState.value = canColorText(editor.value)  
    
    // 3. 检查可见性
    if (props.hideWhenUnavailable) {
      isVisible.value = editor.value.isEditable && canColorTextState.value
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

  /** 应用颜色 */
  const setColor = (color: string) => {
    if (!editor.value) return
    editor.value.chain().focus().setColor(color).run()
    
    // 触发回调
    props.onApplied?.({ color })
  }

  /** 移除颜色 */
  const unsetColor = () => {
    if (!editor.value) return
    editor.value.chain().focus().unsetColor().run()
    props.onApplied?.({ color: '' })
  }

  return {
    editor,
    currentColor,
    isActive,
    canColorText: canColorTextState,
    isVisible,
    label,
    shortcutKeys,
    Icon,
    setColor,
    unsetColor,
    handleColorText: setColor,
    handleUnsetColor: unsetColor
  }
}

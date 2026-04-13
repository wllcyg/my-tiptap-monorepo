// src/components/tiptap-toolbar/config.ts

/**
 * 支持的所有工具栏按钮键名
 * 父组件通过 :tools="['bold', 'italic', ...]" 的方式传入这些字符串
 */
export type ToolbarItemType =
    | 'undo'
    | 'redo'
    | 'paragraph' // 正文
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'bulletList'
    | 'orderedList'
    | 'taskList'
    | 'blockquote'
    | 'codeBlock'
    | 'horizontalRule'
    | 'divider'   // 分隔线
    | 'image'
    | 'link'
    | 'highlight'
// 你可以随时在这里继续扩展新功能

/**
 * 默认工具栏配置
 * 用户不传 tools 时使用这个顺序
 */
export const DEFAULT_TOOLS: ToolbarItemType[] = [
    'undo',
    'redo',
    'divider',
    'bold',
    'italic',
    'highlight',
    // 'underline', // StarterKit 不包含 underline，需单独引入 Underline 扩展
    // 'strike',
    'divider',
    'paragraph',
    'h1',
    'h2',
    'h3',
    'divider',
    'bulletList',
    'orderedList',
    'blockquote',
    'codeBlock',
    'horizontalRule',
]
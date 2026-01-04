export type ToolbarItemType =
    | 'undo'
    | 'redo'
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'bulletList'
    | 'orderedList'
    | 'blockquote'
    | 'codeBlock'
    | 'horizontalRule'
// 可以继续扩展

export const DEFAULT_TOOLS: ToolbarItemType[] = [
    'undo',
    'redo',
    'bold',
    'italic',
    // 'underline', // StarterKit doesn't include underline
    'h1',
]

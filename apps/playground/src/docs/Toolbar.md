# 工具栏配置 (Toolbar)

你可以通过 `tools` 属性完全自定义工具栏的展示。

## 默认配置
如果不传递 `tools` 属性，编辑器将使用一组标准的默认工具。

## 自定义示例
你可以传入一个 `ToolbarItemType[]` 数组来指定需要的按钮及其顺序。

```vue
<template>
  <TiptapEditor :tools="['bold', 'italic', 'color', 'h1', 'bulletList', 'undo', 'redo']" />
</template>
```

### 可选的工具类型 (ToolbarItemType)
`undo`, `redo`, `bold`, `italic`, `paragraph`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `bulletList`, `orderedList`, `blockquote`, `codeBlock`, `horizontalRule`, `divider`, `highlight`, `color`

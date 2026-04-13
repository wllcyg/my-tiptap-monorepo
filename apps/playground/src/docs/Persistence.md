# 数据持久化 (Persistence)

在实际应用中，通常需要将编辑器内容保存到数据库或本地存储。

## 1. 核心钩子

Tiptap 提供了丰富的生命周期钩子来辅助内容的持久化：

- `onUpdate`: 当内容发生变化时触发。建议在此处调用保存操作或设置定时同步。
- `onTransaction**: 更细粒度的变化捕获。

## 2. 交互逻辑

```typescript
const editor = useEditor({
  content: props.modelValue,
  onUpdate: () => {
    // 实时同步到父组件或存储层
    emit('update:modelValue', editor.value?.getHTML())
  }
})
```

## 3. 示例场景

在“自动保存”页面，你可以开启开关并在修改内容后观察浏览器的 `localStorage` 变化。

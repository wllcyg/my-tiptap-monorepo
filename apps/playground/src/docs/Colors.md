# 文本颜色与高亮 (Colors)

通过 `TextStyle`, `Color` 和 `Highlight` 扩展，用户可以轻松改变文本的外观。

## 1. 扩展注册

```typescript
import { TiptapEditor } from '@myorg/tiptap-lib'
import { TextStyle, Color, Highlight } from '@myorg/tiptap-lib' // 我们封装好的版本

const extensions = [
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true })
]
```

## 2. 交互界面

我们提供了内置的 **Popover** 组件，集成了高对比度的色盘：

- **文字颜色**: 改变选中文字的前景色。
- **背景高亮**: 改变选中文字的背景底色。

你可以直接在欢迎页面体验这两个功能的联动效果。

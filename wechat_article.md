# 别再用传统的富文本了！Vue 3 + Tiptap：现代编辑器的新选择

> 在 Web 开发中，富文本编辑器一直是“深水区”。从早期的 UEditor 到后来的 Quill，再到现在的 Tiptap，技术的演进从未停止。今天，我们要聊聊为什么 Tiptap 成了目前 Vue 3 生态下的明星级选择。

---

## 1. 为什么是 Tiptap？

传统的编辑器（如 Quill 或 CKEditor）往往是一个“黑盒”。它们提供现成的 UI 和功能，但当你想要深度定制——比如加入一个自定义的拖拽组件，或者改变选区逻辑时，往往会陷入“魔改”的痛苦。

**Tiptap 的哲学完全不同：它是无头的（Headless）。**

这意味着它只提供逻辑和核心（基于强大的 ProseMirror），而不强制要求任何 UI 样式。作为开发者，你可以：
- **100% 控制样式**：你可以用 Tailwind CSS, Less 或 Naive UI 打造属于你自己的工具栏。
- **极致的扩展性**：每一个功能（加粗、链接、图片、甚至是自定义的任务列表）都是一个 Extension。
- **Vue 3 友好**：完美的 Composition API 支持，让编辑器状态管理像变数一样简单。

---

## 2. 项目亮点：我的 Tiptap Monorepo 实践

在我的最新项目 `my-tiptap-monorepo` 中，我尝试将 Tiptap 的能力发挥到极致。以下是这个项目的核心特色：

### 🚀 完美的 Monorepo 架构
采用 `pnpm workspaces` + `Turborepo`。编辑器核心逻辑被封装在 `@myorg/tiptap-lib` 包中，应用层 `apps/playground` 可以无缝调用。这种解耦方式非常适合中大型企业级应用的开发。

### 🎨 极简美学 UI
基于 **Naive UI** 打造。我们弃用了简陋的默认按钮，重新设计了一套带有 **macOS 风格** 的交互面板：
- **毛玻璃效果（Glassmorphism）**：工具栏支持背景模糊，适配各种炫酷背景。
- **暗黑模式**：完美适配深色主题，保护开发者双眼。

### ⚡ 毫秒级状态响应
通过自定义的 `useActive` 钩子，我们解决了富文本状态同步的痛点。
```typescript
// 实时获取当前选区是否加粗，毫秒级响应
const isActive = useActive("bold");
```

---

## 3. 核心代码一览

在 Tiptap 中，创建一个功能完备的编辑器从未如此优雅：

```vue
<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  content: '<p>Hello Tiptap! 🚀</p>',
  extensions: [StarterKit], // 包含常用的加粗、斜体、列表等
});
</script>

<template>
  <div class="editor-container">
    <EditorContent :editor="editor" />
  </div>
</template>
```

---

## 4. 结语：富文本的未来

未来已来。Tiptap 不仅仅是一个编辑器，它更是一个“编辑器框架”。如果你厌倦了改不动样式的传统编辑器，不妨试试 Tiptap，感受一下“无头”带来的自由。

**想看演示？**
我也同步配置了 **GitHub Actions** 自动化部署，Playground 页面即将上线 GitHub Pages，敬请期待！

---

> **作者：你的结对编程伙伴**
> **项目地址：wllcyg/my-tiptap-monorepo**

<!-- src/components/TiptapEditor.vue -->
<template>
  <div class="tiptap-normal-container">
    <div class="tiptap-toolbar-wrapper flex items-center border-b border-gray-300 dark:border-gray-700">
      <slot name="toolbar-left" />
      <ToolBar :tools="resolvedTools" class="flex-1" />
      <slot name="toolbar-right" />
    </div>

    <EditorContent :editor="editor" class="tiptap-prosemirror" />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import DropCursor from "@tiptap/extension-dropcursor";
import Highlight from "@tiptap/extension-highlight";
// 可选：空内容占位提示
// import Placeholder from "@tiptap/extension-placeholder";

import ToolBar from "./ToolBar.vue";
import { provideTiptapEditor } from "../composables/useTiptapEditor";
import type { ToolbarItemType } from "../types/toolbar";
import type { Extension } from "@tiptap/core";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: true,
  },
  /** 是否自动聚焦 */
  autoFocus: {
    type: Boolean,
    default: true,
  },
  /** 工具栏按钮配置 */
  tools: {
    type: Array as () => ToolbarItemType[],
    default: () => [], // 默认空数组
  },
  /** 用户自定义扩展 */
  extensions: {
    type: Array as () => Extension[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

// 当父组件未传入 tools 时，使用 ToolBar 内部的 DEFAULT_TOOLS
const resolvedTools = computed(() => {
  return props.tools.length > 0 ? props.tools : undefined;
});

const editor = useEditor({
  editorProps: {
    attributes: {
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      "aria-label": "Main content area, start typing to enter text.",
      class: "simple-editor prose dark:prose-invert max-w-none focus:outline-none",
    },
  },
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: false, // 禁用默认的 heading 扩展
      dropcursor: false, // 禁用默认的 dropcursor 扩展，以解决重复注册警告
    }),
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6], // 根据文档明确支持所有的 h1-h6 标签
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: {
        class: "max-w-full rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 my-4",
      },
    }),
    DropCursor.configure({
      color: "#8b5cf6",
      width: 2,
    }),
    Highlight.configure({ multicolor: true }),
    // Placeholder.configure({ placeholder: "开始书写..." }), // 需要时取消注释
    ...props.extensions,
  ],
  editable: props.editable,
  autofocus: false,
  onUpdate: () => {
    emit("update:modelValue", editor.value?.getHTML() ?? "");
  },
});

provideTiptapEditor(editor);

// v-model 双向同步（防止死循环）
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== editor.value?.getHTML()) {
      editor.value?.commands.setContent(newVal ?? "", false);
    }
  }
);

// editable 切换
watch(
  () => props.editable,
  (val) => {
    editor.value?.setEditable(val ?? true);
  }
);

// 自动聚焦 + 光标置末尾
onMounted(async () => {
  if (!props.autoFocus || !editor.value) return;

  await nextTick();
  if (props.modelValue) {
    editor.value.chain().focus("end").run();
  } else {
    editor.value.chain().focus("start").run();
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

defineExpose({ editor });
</script>

<style lang="scss" scoped>
.tiptap-normal-wrapper {
  @apply w-full;
}

.tiptap-normal-container {
  @apply max-w-4xl mx-auto rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden;
}

.tiptap-normal-container .tiptap-prosemirror {
  @apply min-h-96 px-10 py-8;
}

/* 通用编辑区样式 */
.tiptap-prosemirror {
  @apply outline-none;

  :deep(.ProseMirror) {
    caret-color: currentColor;
    outline: none !important;

    &:focus {
      outline: none !important;
    }

    &::before,
    &::after {
      display: none !important;
    }

    p {
      min-height: 1.5em;
      margin: 0.5em 0;
    }

    /* ===== Heading 样式 ===== */
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.3;
      font-weight: 700;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: inherit;
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.25em;
    }

    h4 {
      font-size: 1.125em;
    }

    h5 {
      font-size: 1em;
      font-weight: 600;
    }

    h6 {
      font-size: 0.875em;
      font-weight: 600;
    }

    /* ===== List 样式 ===== */
    ul, ol {
      padding-left: 1.5rem;
      margin: 0.75em 0;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    li {
      margin: 0.25em 0;
      padding-left: 0.25em;
    }

    /* 嵌套列表 */
    ul ul, ol ul {
      list-style-type: circle;
      margin: 0.25em 0;
    }

    ul ul ul, ol ul ul {
      list-style-type: square;
    }

    ol ol, ul ol {
      list-style-type: lower-alpha;
      margin: 0.25em 0;
    }

    ol ol ol, ul ol ol {
      list-style-type: lower-roman;
    }

    /* ===== Blockquote 样式 ===== */
    blockquote {
      border-left: 3px solid #d1d5db;
      padding-left: 1rem;
      margin: 1em 0;
      color: #6b7280;
    }

    /* ===== Code Block 样式 ===== */
    pre {
      background: #f3f4f6;
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1em 0;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.875em;
      line-height: 1.5;
    }

    code {
      background: #f3f4f6;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
      font-family: 'Courier New', Courier, monospace;
    }

    pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }

    /* ===== Horizontal Rule 样式 ===== */
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 2em 0;
    }

    /* ===== Dark Mode 适配 ===== */
    .dark & {
      blockquote {
        border-left-color: #4b5563;
        color: #9ca3af;
      }

      pre {
        background: #1f2937;
      }

      code {
        background: #1f2937;
      }

      hr {
        border-top-color: #374151;
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .tiptap-prosemirror {
    @apply px-6 py-8;
  }
}

/* 极简滚动条（建议移到全局样式） */
::-webkit-scrollbar {
  width: 0.25rem;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175 / 0.5) transparent;
}

.dark * {
  scrollbar-color: rgb(107 114 128 / 0.5) transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}
</style>
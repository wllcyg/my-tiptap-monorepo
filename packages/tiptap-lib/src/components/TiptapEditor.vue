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
      class: "simple-editor",
    },
  },
  content: props.modelValue,
  extensions: [
    StarterKit.configure({}),
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
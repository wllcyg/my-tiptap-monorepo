<!-- src/components/TiptapEditor.vue -->
<template>
  <div
    class="tiptap-root"
    :class="{
      'tiptap-fullscreen-wrapper': fullScreen,
      'tiptap-normal-wrapper': !fullScreen,
    }"
  >
    <!-- 全屏沉浸式写作模式 -->
    <div v-if="fullScreen" class="tiptap-fullscreen-content">
      <EditorContent :editor="editor" class="tiptap-prosemirror" />
    </div>

    <!-- 普通模式（带边框容器） -->
    <div v-else class="tiptap-normal-container">
      <EditorContent :editor="editor" class="tiptap-prosemirror" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount, onMounted, nextTick } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: true,
  },
  /** 是否启用全屏沉浸式写作模式 */
  fullScreen: {
    type: Boolean,
    default: false,
  },
  /** 是否自动聚焦（默认开启，与官方模板一致） */
  autoFocus: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editable: props.editable,
  autofocus: false, // 先关闭内置 autofocus，后续手动精准控制
  onUpdate: () => {
    emit("update:modelValue", editor.value?.getHTML() ?? "");
  },
});

// 自动聚焦 + 光标置末尾
onMounted(async () => {
  if (!props.autoFocus || !editor.value) return;

  await nextTick(); // 确保 DOM 已渲染（EditorContent 已挂载）

  // 先聚焦
  editor.value.chain().focus();

  // 如果有内容，将光标移到末尾（官方常见行为）
  if (props.modelValue) {
    editor.value.chain().focus("end").run();
  }
  // 空内容时默认在 start，已有光标闪烁
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== editor.value?.getHTML()) {
      editor.value?.commands.setContent(val ?? "", false);
    }
  }
);

watch(
  () => props.editable,
  (val) => {
    editor.value?.setEditable(val);
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

defineExpose({ editor });
</script>

<style lang="scss" scoped>
// 极简滚动条
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

/* 全屏沉浸模式 */
.tiptap-fullscreen-wrapper {
  @apply fixed inset-0 z-50 w-screen h-screen overflow-auto bg-white dark:bg-gray-900;
}

.tiptap-fullscreen-content {
  @apply max-w-3xl w-full mx-auto h-full flex flex-col;
}

.tiptap-prosemirror {
  @apply flex-1 px-12 py-10 pb-[30vh] outline-none;
  /* 编辑区专用字体 + 修复光标下划线问题 */
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
    @apply px-6 py-8 pb-[30vh];
  }
}

/* 普通模式（非全屏） */
.tiptap-normal-wrapper {
  @apply w-full;
}

.tiptap-normal-container {
  @apply max-w-4xl mx-auto rounded-xl border border-gray-300 dark:border-gray-700 
         bg-white dark:bg-gray-900 shadow-lg overflow-hidden;
}

.tiptap-normal-container .tiptap-prosemirror {
  @apply min-h-96 px-10 py-8;

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
</style>

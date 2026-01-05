<template>
  <n-tooltip>
    <template #trigger>
      <n-button text size="large" :disabled="!canUndo" class="toolbar-btn" @click="undo">
        <icon-undo class="w-5 h-5" />
        <span class="ml-1 hidden sm:inline">撤销</span>
      </n-button>
    </template>
    撤销 (Ctrl+Z)
  </n-tooltip>
</template>

<script setup lang="ts">
import { useTiptapEditor } from "../../composables";
import { computed } from "vue";
import { NTooltip, NButton } from "naive-ui";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const canUndo = computed(() => editor.value?.can().undo() ?? false);

const undo = () => {
  editor.value?.chain().focus().undo().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>
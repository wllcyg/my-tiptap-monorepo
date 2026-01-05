<template>
  <n-tooltip>
    <template #trigger>
      <n-button text size="large" :disabled="!canRedo" class="toolbar-btn" @click="redo">
        <icon-redo class="w-5 h-5" />
        <span class="ml-1 hidden sm:inline">重做</span>
      </n-button>
    </template>
    重做 (Ctrl+Y)
  </n-tooltip>
</template>

<script setup lang="ts">
import { useTiptapEditor } from "../../composables";
import { computed } from "vue";
import { NTooltip, NButton } from "naive-ui";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const canRedo = computed(() => editor.value?.can().redo() ?? false);

const redo = () => {
  editor.value?.chain().focus().redo().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>
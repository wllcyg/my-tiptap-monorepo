<template>

  <n-button text size="large" :disabled="!canUndo" class="toolbar-btn" @click="undo">
    <n-icon size="20">
      <ArrowUndo />
    </n-icon>
  </n-button>

</template>

<script setup lang="ts">
import { useTiptapEditor } from "../../composables";
import { computed } from "vue";
import { NTooltip, NButton, NIcon } from "naive-ui";
import { ArrowUndo } from '@vicons/ionicons5'
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
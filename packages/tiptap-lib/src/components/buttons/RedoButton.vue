<template>
  <n-button text size="large" :disabled="!canRedo" class="toolbar-btn" @click="redo">
    <n-icon size="20">
      <ArrowRedo />
    </n-icon>
  </n-button>

</template>

<script setup lang="ts">
import { useTiptapEditor } from "../../composables";
import { computed } from "vue";
import { NButton, NIcon } from "naive-ui";
import { ArrowRedo } from '@vicons/ionicons5'

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
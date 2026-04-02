<template>
  <n-button text size="large" class="toolbar-btn" @click="insert">
    <n-icon size="20">
      <RemoveOutline />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NIcon } from "naive-ui";
import { RemoveOutline } from "@vicons/ionicons5";
import { useTiptapEditor } from "../../composables";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const insert = () => {
  editor.value?.chain().focus().setHorizontalRule().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>

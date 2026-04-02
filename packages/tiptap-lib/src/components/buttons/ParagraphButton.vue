<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    @click="setParagraph"
  >
    <span class="p-label">正文</span>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";
import { useTiptapEditor } from "../../composables";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const setParagraph = () => {
  editor.value?.chain().focus().setParagraph().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10 px-1;
}

.p-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
}
</style>

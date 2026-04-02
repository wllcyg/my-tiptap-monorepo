<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="toggle"
  >
    <n-icon size="20">
      <List />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NIcon } from "naive-ui";
import { List } from "@vicons/ionicons5";
import { useTiptapEditor, useActive } from "../../composables";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const isActive = useActive("bulletList");

const toggle = () => {
  editor.value?.chain().focus().toggleBulletList().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>

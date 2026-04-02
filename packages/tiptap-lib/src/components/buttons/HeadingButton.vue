<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="toggle"
  >
    <span class="heading-label">H{{ level }}</span>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";
import { useTiptapEditor, useActive } from "../../composables";

const props = defineProps<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
}>();

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const isActive = useActive("heading", { level: props.level });

const toggle = () => {
  editor.value?.chain().focus().toggleHeading({ level: props.level }).run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}

.heading-label {
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}
</style>

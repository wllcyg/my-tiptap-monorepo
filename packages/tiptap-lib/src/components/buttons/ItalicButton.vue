<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="toggle"
  >
    <n-icon size="20">
      <TextItalic />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { NButton, NIcon } from "naive-ui";
import { useTiptapEditor, useActive } from "../../composables";

const TextItalic = defineComponent({
  render() {
    return h(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
      [
        h("path", {
          d: "M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z",
        }),
      ]
    );
  },
});

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const isActive = useActive("italic");

const toggle = () => {
  editor.value?.chain().focus().toggleItalic().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>

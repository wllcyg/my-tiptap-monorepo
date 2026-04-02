<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="toggle"
  >
    <n-icon size="20">
      <TextBold />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { NButton, NIcon } from "naive-ui";
import { useTiptapEditor, useActive } from "../../composables";

// ionicons5 没有 Bold 图标，用自定义 SVG 渲染
const TextBold = defineComponent({
  render() {
    return h(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
      [
        h("path", {
          d: "M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm0 2v5h5a2.5 2.5 0 0 0 0-5H8ZM6 4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.5 4.5 0 0 1 13 20H6V4Z",
        }),
      ]
    );
  },
});

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const isActive = useActive("bold");

const toggle = () => {
  editor.value?.chain().focus().toggleBold().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>

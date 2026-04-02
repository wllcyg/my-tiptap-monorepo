<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="toggle"
  >
    <n-icon size="20">
      <ListNumbered />
    </n-icon>
  </n-button>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from "vue";
import { NButton, NIcon } from "naive-ui";
import { useTiptapEditor, useActive } from "../../composables";

// ionicons5 没有有序列表图标，用自定义 SVG
const ListNumbered = defineComponent({
  render() {
    return h(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
      [
        h("path", {
          d: "M8 4h13v2H8V4ZM5 3v3H3V4H2V3h3ZM2 11h2v-1h1v4H4v-2H2v-1Zm2 7v1H2v1h3v-4H3v1h1ZM8 11h13v2H8v-2ZM8 18h13v2H8v-2Z",
        }),
      ]
    );
  },
});

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

const isActive = useActive("orderedList");

const toggle = () => {
  editor.value?.chain().focus().toggleOrderedList().run();
};
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}
</style>

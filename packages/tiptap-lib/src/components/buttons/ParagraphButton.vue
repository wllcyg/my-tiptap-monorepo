<template>
  <n-button
    text
    size="large"
    class="toolbar-btn"
    :class="{ 'is-active': isActive }"
    @click="setParagraph"
  >
    <span class="p-label">正文</span>
  </n-button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { NButton } from "naive-ui";
import { useTiptapEditor } from "../../composables";

const editorRef = useTiptapEditor();
const editor = computed(() => editorRef.value);

// 正文按钮的 active 状态：只有当前是纯段落时才高亮（不在标题、列表等其他结构中）
const isActive = ref(false);

const updateActive = () => {
  const ed = editor.value;
  if (!ed) {
    isActive.value = false;
    return;
  }
  
  // 获取当前节点类型
  const { $from } = ed.state.selection;
  const node = $from.node($from.depth);
  
  // 只有当前节点是 paragraph 且父节点是 doc 时才认为是"正文"
  // 这样可以排除列表项中的段落
  isActive.value = node.type.name === 'paragraph' && $from.depth === 1;
};

onMounted(() => {
  const ed = editor.value;
  if (ed) {
    ed.on('transaction', updateActive);
    ed.on('selectionUpdate', updateActive);
    ed.on('update', updateActive);
    updateActive();
  }
});

onBeforeUnmount(() => {
  const ed = editor.value;
  if (ed) {
    ed.off('transaction', updateActive);
    ed.off('selectionUpdate', updateActive);
    ed.off('update', updateActive);
  }
});

watch(editorRef, (newEditor) => {
  if (newEditor) {
    newEditor.on('transaction', updateActive);
    newEditor.on('selectionUpdate', updateActive);
    newEditor.on('update', updateActive);
    updateActive();
  }
}, { immediate: true });

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

<template>
  <div
    class="tiptap-toolbar px-6 py-3 border-b border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
    <n-space align="center" :size="[4, 16]">
      <!-- 左侧工具按钮 -->
      <component v-for="(toolKey, index) in resolvedTools" :is="getComponent(toolKey)"
        :key="`tool-${toolKey}-${index}`" />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NSpace } from "naive-ui";
import { ToolbarItemType, DEFAULT_TOOLS } from '../types/toolbar'
// ==================== 导入按钮组件 ====================
import UndoButton from "./buttons/UndoButton.vue";
import RedoButton from "./buttons/RedoButton.vue";

// ==================== 映射表 ====================
const toolMapBase = {
  undo: UndoButton,
  redo: RedoButton,
} as const;

// 关键：强制断言为完整映射，解决索引报错
const toolMap = toolMapBase as Record<ToolbarItemType, any>;

// 运行时安全获取组件
const getComponent = (key: ToolbarItemType): any => {
  const component = toolMap[key];
  if (!component && process.env.NODE_ENV === "development") {
    console.warn(`[Tiptap Toolbar] 未注册的工具: "${key}"，已跳过渲染。请在 toolMapBase 中添加对应组件。`);
  }
  return component || null;
};

// ==================== Props（必须正确定义）================
const props = defineProps<{
  tools?: ToolbarItemType[];
}>();

// ==================== Emits ====================
defineEmits(["save", "toggle-fullscreen"]);

// ==================== 关键修复：响应式 computed ====================
const resolvedTools = computed<ToolbarItemType[]>(() => {
  return props.tools ?? DEFAULT_TOOLS;
});
</script>

<style lang="scss" scoped>
.tiptap-toolbar {
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(12px);
}

:deep(.n-button--text-type.is-active) {
  @apply bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded;
}

:deep(.n-button--text-type:hover:not([disabled])) {
  @apply bg-slate-100 dark:bg-gray-800;
}
</style>
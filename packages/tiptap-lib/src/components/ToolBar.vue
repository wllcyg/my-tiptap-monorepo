<template>
  <div
    class="tiptap-toolbar px-6 py-3 border-b border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
  >
    <n-space align="center" :size="[4, 16]">
      <!-- 左侧工具按钮 -->
      <component
        v-for="(toolKey, index) in resolvedTools"
        :is="getComponent(toolKey)"
        :key="`tool-${toolKey}-${index}`"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, defineAsyncComponent } from "vue";
import { NSpace } from "naive-ui";
import type { ToolbarItemType } from "../types/toolbar";
import { DEFAULT_TOOLS } from "../types/toolbar";

// ==================== 异步导入按钮组件 ====================
const UndoButton = defineAsyncComponent(() => import("./buttons/UndoButton.vue"));
const RedoButton = defineAsyncComponent(() => import("./buttons/RedoButton.vue"));
const BoldButton = defineAsyncComponent(() => import("./buttons/BoldButton.vue"));
const ItalicButton = defineAsyncComponent(() => import("./buttons/ItalicButton.vue"));
const ParagraphButton = defineAsyncComponent(() => import("./buttons/ParagraphButton.vue"));
const HeadingButton = defineAsyncComponent(() => import("./buttons/HeadingButton.vue"));
const BulletListButton = defineAsyncComponent(() => import("./buttons/BulletListButton.vue"));
const OrderedListButton = defineAsyncComponent(() => import("./buttons/OrderedListButton.vue"));
const BlockquoteButton = defineAsyncComponent(() => import("./buttons/BlockquoteButton.vue"));
const CodeBlockButton = defineAsyncComponent(() => import("./buttons/CodeBlockButton.vue"));
const HorizontalRuleButton = defineAsyncComponent(() => import("./buttons/HorizontalRuleButton.vue"));
const DividerButton = defineAsyncComponent(() => import("./buttons/DividerButton.vue"));
const HighlightButton = defineAsyncComponent(() => import("./color-highlight-popover/ColorHighlightPopover.vue"));
const ColorTextButton = defineAsyncComponent(() => import("./color-text-popover/ColorTextPopover.vue"));

// h1-h6 工厂：为 HeadingButton 注入不同 level
const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  defineComponent({
    name: `H${level}Button`,
    render: () => h(HeadingButton, { level }),
  });

// ==================== 映射表 ====================
const toolMapBase = {
  undo: UndoButton,
  redo: RedoButton,
  bold: BoldButton,
  italic: ItalicButton,
  paragraph: ParagraphButton,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  bulletList: BulletListButton,
  orderedList: OrderedListButton,
  blockquote: BlockquoteButton,
  codeBlock: CodeBlockButton,
  horizontalRule: HorizontalRuleButton,
  divider: DividerButton,
  highlight: HighlightButton,
  color: ColorTextButton,
} as const;

// 关键：强制断言为完整映射，解决索引报错
const toolMap = toolMapBase as Record<ToolbarItemType, any>;

// 运行时安全获取组件
const getComponent = (key: ToolbarItemType): any => {
  const component = toolMap[key];
  // @ts-ignore
  if (!component && typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
    console.warn(
      `[Tiptap Toolbar] 未注册的工具: "${key}"，已跳过渲染。请在 toolMapBase 中添加对应组件。`,
    );
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
  margin-top: 12px;
}

/* 使用更高的优先级覆盖 Naive UI 的初始背景色 */
:deep(.n-button.is-active) {
  background-color: #cbd5e1 !important; /* slate-300 for light */
  color: #0f172a !important; /* slate-900 */
  font-weight: 600 !important;
  border-radius: 6px !important;
}

.dark :deep(.n-button.is-active) {
  background-color: #3f3f46 !important; /* zinc-700 for dark */
  color: #ffffff !important;
}

:deep(.n-button:hover:not([disabled])) {
  background-color: #f1f5f9 !important; /* slate-100 */
}

.dark :deep(.n-button:hover:not([disabled])) {
  background-color: #1f2937 !important; /* gray-800 */
}
</style>

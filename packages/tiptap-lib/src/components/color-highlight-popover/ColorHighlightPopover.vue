<template>
  <n-popover v-if="isVisible" trigger="click" placement="bottom" scrollable class="highlight-popover">
    <template #trigger>
      <n-button
        text
        size="large"
        class="toolbar-btn"
        :class="{ 'is-active': !!currentColor }"
        :title="label"
        :disabled="!canColorHighlight"
      >
        <template #icon>
          <n-icon :component="Icon" :style="{ color: currentColor || 'inherit' }" />
        </template>
      </n-button>
    </template>
    
    <ColorHighlightPopoverContent :colors="colors" :on-applied="onApplied" />
  </n-popover>
</template>

<script setup lang="ts">
import { NButton, NPopover, NIcon } from "naive-ui";
import { useColorHighlight } from "./useColorHighlight";
import ColorHighlightPopoverContent from "./ColorHighlightPopoverContent.vue";

const props = defineProps<{
  /** 当不可用时是否自动隐藏按钮 */
  hideWhenUnavailable?: boolean;
  /** 应用高亮后的回调 */
  onApplied?: (data: { color: string }) => void;
}>();

const { currentColor, isVisible, canColorHighlight, label, Icon } = useColorHighlight({
  hideWhenUnavailable: props.hideWhenUnavailable,
  onApplied: props.onApplied
});

const colors = [
  { label: '黄色', value: '#fff3bf' },
  { label: '绿色', value: '#d3f9d8' },
  { label: '蓝色', value: '#d0ebff' },
  { label: '紫色', value: '#f3d9fa' },
  { label: '粉色', value: '#ffdeeb' },
  { label: '橙色', value: '#ffd8a8' },
  { label: '红色', value: '#ffc9c9' },
  { label: '灰色', value: '#f1f3f5' },
];
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}

.highlight-popover {
  border-radius: 8px;
}
</style>

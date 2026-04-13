<template>
  <n-popover v-if="isVisible" trigger="click" placement="bottom" scrollable class="text-color-popover">
    <template #trigger>
      <n-button
        text
        size="large"
        class="toolbar-btn"
        :class="{ 'is-active': !!currentColor }"
        :title="label"
        :disabled="!canColorText"
      >
        <template #icon>
          <n-icon :component="Icon" :style="{ color: currentColor || 'inherit' }" />
        </template>
      </n-button>
    </template>
    
    <ColorTextPopoverContent :colors="colors" :on-applied="onApplied" />
  </n-popover>
</template>

<script setup lang="ts">
import { NButton, NPopover, NIcon } from "naive-ui";
import { useColorText } from "./useColorText";
import ColorTextPopoverContent from "./ColorTextPopoverContent.vue";

const props = defineProps<{
  /** 当不可用时是否自动隐藏按钮 */
  hideWhenUnavailable?: boolean;
  /** 应用颜色后的回调 */
  onApplied?: (data: { color: string }) => void;
  /** 自定义颜色列表 */
  colors?: { label: string; value: string }[];
}>();

const { currentColor, isVisible, canColorText, label, Icon } = useColorText({
  hideWhenUnavailable: props.hideWhenUnavailable,
  onApplied: props.onApplied
});
</script>

<style scoped>
.toolbar-btn {
  @apply min-w-10;
}

.text-color-popover {
  border-radius: 8px;
}
</style>

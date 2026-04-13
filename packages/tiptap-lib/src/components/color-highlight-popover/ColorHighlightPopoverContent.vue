<template>
  <div class="highlight-color-picker">
    <div class="color-grid">
      <div 
        class="color-option-none" 
        title="清除高亮"
        @click="removeHighlight"
      >
        <n-icon :component="Ban" />
      </div>
      <div
        v-for="color in (colors || defaultColors)"
        :key="color.value"
        class="color-option"
        :style="{ backgroundColor: color.value }"
        :title="color.label"
        :class="{ 'is-active': currentColor === color.value }"
        @click="setHighlight(color.value)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import { Ban } from "@vicons/ionicons5";
import { useColorHighlight } from "./useColorHighlight";

interface ColorOption {
  label: string;
  value: string;
}

const props = defineProps<{
  /** 自定义颜色列表，若不传则使用默认色盘 */
  colors?: ColorOption[];
  /** 应用高亮后的回调 */
  onApplied?: (data: { color: string }) => void;
}>();

const { currentColor, setHighlight, removeHighlight } = useColorHighlight({
  onApplied: props.onApplied
});

const defaultColors: ColorOption[] = [
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
.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px;
}

.color-option, .color-option-none {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option:hover, .color-option-none:hover {
  transform: scale(1.1);
  border-color: #3b82f6;
}

.color-option.is-active {
  border-color: #3b82f6;
  border-width: 2px;
}

.color-option-none {
  background-color: transparent;
  color: #9ca3af;
}
</style>

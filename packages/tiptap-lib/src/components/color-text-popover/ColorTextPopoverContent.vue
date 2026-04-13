<template>
  <div class="color-text-picker">
    <div class="color-grid">
      <div 
        class="color-option-none" 
        title="清除颜色"
        @click="unsetColor"
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
        @click="setColor(color.value)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import { Ban } from "@vicons/ionicons5";
import { useColorText } from "./useColorText";

interface ColorOption {
  label: string;
  value: string;
}

const props = defineProps<{
  /** 自定义颜色列表 */
  colors?: ColorOption[];
  /** 应用颜色后的回调 */
  onApplied?: (data: { color: string }) => void;
}>();

const { currentColor, setColor, unsetColor } = useColorText({
  onApplied: props.onApplied
});

// 文本颜色通常需要更高的对比度，所以使用更深的色盘
const defaultColors: ColorOption[] = [
  { label: '黑色', value: '#000000' },
  { label: '灰色', value: '#495057' },
  { label: '红色', value: '#e03131' },
  { label: '粉色', value: '#c2255c' },
  { label: '紫色', value: '#9c36b5' },
  { label: '深蓝', value: '#1971c2' },
  { label: '浅蓝', value: '#228be6' },
  { label: '青色', value: '#0c8599' },
  { label: '绿色', value: '#2f9e44' },
  { label: '橙色', value: '#e67700' },
  { label: '棕色', value: '#862e9c' },
  { label: '黄色', value: '#f08c00' },
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

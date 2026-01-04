<script setup lang="ts">
// Spacer.vue

import { computed, type CSSProperties } from 'vue'

// 定义方向类型
type SpacerOrientation = 'horizontal' | 'vertical'

// 定义 Props
const props = defineProps<{
  orientation?: SpacerOrientation
  size?: string | number
  style?: CSSProperties
}>()

// 计算最终的 style
const computedStyle = computed(() => {
  const baseStyle: CSSProperties = { ...props.style }

  // 水平方向 + 无 size → 自动弹性占满剩余空间
  if (props.orientation === 'horizontal' && props.size === undefined) {
    baseStyle.flex = 1
  }

  // 有 size 时，设置对应方向的尺寸，另一方向固定 1px
  if (props.size !== undefined) {
    if (props.orientation === 'vertical') {
      baseStyle.width = '1px'
      baseStyle.height = typeof props.size === 'number' ? `${props.size}px` : props.size
    } else {
      // horizontal
      baseStyle.height = '1px'
      baseStyle.width = typeof props.size === 'number' ? `${props.size}px` : props.size
    }
  }

  return baseStyle
})
</script>

<template>
  <!-- 直接 v-bind="$attrs" 透传所有非 props 属性（class、id、aria-*、事件等） -->
  <div v-bind="$attrs" :style="computedStyle" />
</template>
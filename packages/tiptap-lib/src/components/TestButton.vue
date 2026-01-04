<template>
  <button
    class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
    @click="count++"
  >
    我是测试按钮 - 点击次数: {{ count }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
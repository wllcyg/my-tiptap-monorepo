# 安装说明

在你的 Vue 3 项目中集成我们的 Tiptap 库非常简单。

## 1. 安装依赖

使用你喜欢的包管理器：

```bash
# pnpm
pnpm add @myorg/tiptap-lib

# npm
npm install @myorg/tiptap-lib

# yarn
yarn add @myorg/tiptap-lib
```

## 2. 基础使用

```vue
<script setup>
import { TiptapEditor } from '@myorg/tiptap-lib'
import { ref } from 'vue'

const content = ref('<p>Hello Tiptap!</p>')
</script>

<template>
  <TiptapEditor v-model="content" />
</template>
```

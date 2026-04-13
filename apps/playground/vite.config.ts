import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/my-tiptap-monorepo/" : "/",
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // 告诉 Vue 插件也包含 .md 文件
    }),
    Markdown({}), // 传入空对象以满足插件的参数要求
  ],
});

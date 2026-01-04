import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TiptapLib',
      fileName: 'tiptap-lib'
    },
    rollupOptions: {
      external: ['vue', '@tiptap/core', '@tiptap/vue-3', '@tiptap/starter-kit'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
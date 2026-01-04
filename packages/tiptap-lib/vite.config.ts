// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,   // 自动在 package.json 中写入 "types": "dist/index.d.ts"
      rollupTypes: true,        // 生成合并的完整声明文件（推荐）
      include: ['src'],
      // 可选：提高类型准确性
      skipDiagnostics: false,
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TiptapLib', // UMD 全局变量名（仅在老项目 require 时有用）
      fileName: (format) => `tiptap-lib.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },

    rollupOptions: {
      // 外部化 peerDependencies（不打包进库）
      external: [
        'vue',
        '@tiptap/core',
        '@tiptap/vue-3',
        '@tiptap/starter-kit',
        // 如果后续添加了其他 tiptap 扩展作为 dependency，也可加在这里
      ],

      output: {
        globals: {
          vue: 'Vue',
        },

        // 关键：固定 CSS 文件名为 style.css（无 hash）
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css'
          }
          // 其他资源（如图片、字体）可以保留 hash
          return 'assets/[name]-[hash][extname]'
        },
      },
    },

    sourcemap: true,           // 开发调试用，发布前可改为 false
    minify: 'esbuild',
    cssCodeSplit: true,        // 确保 CSS 单独输出
  },

  css: {
    postcss: {
      plugins: [
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer'),
      ],
    },
  },
})
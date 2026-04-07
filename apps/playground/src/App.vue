<script setup lang="ts">
import TiptapEditor from "@myorg/tiptap-lib";
import { ref, computed } from "vue";
import { useImageUpload } from "./composables/useImageUpload";

const content = ref(
  "<p>Hello Tiptap! 🚀</p><p>这是一个 <strong>富文本编辑器</strong> 演示。试试工具栏中的各种功能吧！</p><p>💡 <em>提示：你可以粘贴（Ctrl+V）或拖拽图片到编辑器中上传图片</em></p>",
);
const showPreview = ref(true);
const wordCount = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, "").trim();
  return text.length;
});

// 图片上传功能
const {
  isReady: uploadReady,
  error: uploadError,
  getExtension,
} = useImageUpload();

// 扩展配置
const extensions = computed(() => {
  const ext = getExtension();
  return ext ? [ext] : [];
});
</script>

<template>
  <div class="app-root" @dragover.prevent @drop.prevent>
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-area">
          <span class="logo-icon">✍️</span>
          <h1 class="logo-text">Tiptap Playground</h1>
        </div>
        <div class="header-actions">
          <span class="word-count">{{ wordCount }} 字</span>
          <button
            class="preview-toggle"
            :class="{ active: showPreview }"
            @click="showPreview = !showPreview"
          >
            {{ showPreview ? "隐藏预览" : "显示预览" }}
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 上传状态提示 -->
      <div v-if="uploadError" class="upload-error">
        <span class="error-icon">⚠️</span>
        <span>图片上传功能初始化失败: {{ uploadError }}</span>
      </div>
      <div v-else-if="!uploadReady" class="upload-loading">
        <span class="loading-spinner">⏳</span>
        <span>正在初始化图片上传功能...</span>
      </div>
      <div v-else class="upload-success">
        <span class="success-icon">✅</span>
        <span>图片上传已就绪 - 支持粘贴和拖拽上传</span>
      </div>

      <div class="editor-panel" :class="{ 'full-width': !showPreview }">
        <div class="panel-header">
          <span class="panel-dot red"></span>
          <span class="panel-dot yellow"></span>
          <span class="panel-dot green"></span>
          <span class="panel-title">编辑器</span>
        </div>
        <TiptapEditor
          v-if="uploadReady"
          v-model="content"
          :extensions="extensions"
        />
        <div v-else class="editor-placeholder">
          <span class="placeholder-spinner">⏳</span>
          <span>正在加载编辑器...</span>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="showPreview" class="preview-panel">
          <div class="panel-header">
            <span class="panel-dot red"></span>
            <span class="panel-dot yellow"></span>
            <span class="panel-dot green"></span>
            <span class="panel-title">实时预览</span>
          </div>
          <div class="preview-body prose" v-html="content" />
        </div>
      </Transition>
    </main>

    <!-- 底部状态栏 -->
    <footer class="app-footer">
      <span>Powered by <strong>Tiptap</strong> + <strong>Vue 3</strong></span>
      <span class="footer-dot">•</span>
      <span>@myorg/tiptap-lib</span>
    </footer>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #e2e8f0;
  font-family:
    "Inter",
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
}

/* ====== Header ====== */
.app-header {
  background: rgba(15, 12, 41, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(90deg, #a78bfa, #818cf8, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.word-count {
  font-size: 0.8rem;
  color: #94a3b8;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
}

.preview-toggle {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.1);
  color: #c4b5fd;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.preview-toggle:hover {
  background: rgba(139, 92, 246, 0.25);
  border-color: rgba(139, 92, 246, 0.6);
}

.preview-toggle.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  color: #ddd6fe;
}

/* ====== Main ====== */
.app-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

/* ====== Upload Status ====== */
.upload-error,
.upload-loading,
.upload-success {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.upload-loading {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.upload-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.error-icon,
.success-icon {
  font-size: 1.1rem;
}

.loading-spinner {
  font-size: 1.1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ====== Editor Container ====== */
.editor-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 400px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.placeholder-spinner {
  font-size: 1.2rem;
  animation: spin 2s linear infinite;
}

.app-main > .editor-panel {
  width: 100%;
}

.app-main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.app-main > .upload-error,
.app-main > .upload-loading,
.app-main > .upload-success {
  flex: 1 1 100%;
}

.app-main > .editor-panel,
.app-main > .preview-panel {
  flex: 1 1 auto;
}

/* ====== Panels ====== */
.editor-panel,
.preview-panel {
  background: rgba(30, 27, 56, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.editor-panel {
  flex: 1;
  min-width: 0;
}

/* 覆盖组件内部的文字颜色，防止白底上继承了外层的浅灰色字体 */
.editor-panel :deep(.tiptap-normal-container) {
  color: #1e293b;
}

.editor-panel.full-width {
  flex: 1;
}

.preview-panel {
  flex: 0 0 420px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.panel-dot.red {
  background: #ef4444;
}
.panel-dot.yellow {
  background: #eab308;
}
.panel-dot.green {
  background: #22c55e;
}

.panel-title {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.preview-body {
  padding: 2rem;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #cbd5e1;
}

.preview-body :deep(p) {
  margin: 0.5em 0;
}

.preview-body :deep(h1) {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0.8em 0 0.4em;
}

.preview-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0.7em 0 0.35em;
}

.preview-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0.6em 0 0.3em;
}

.preview-body :deep(strong) {
  color: #f1f5f9;
  font-weight: 600;
}

.preview-body :deep(em) {
  color: #c4b5fd;
}

.preview-body :deep(blockquote) {
  border-left: 3px solid #8b5cf6;
  padding-left: 1rem;
  color: #94a3b8;
  margin: 1em 0;
}

.preview-body :deep(code) {
  background: rgba(139, 92, 246, 0.15);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  color: #c4b5fd;
}

.preview-body :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.preview-body :deep(ul),
.preview-body :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

.preview-body :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1.5em 0;
}

/* ====== Transition ====== */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
  flex-basis: 0 !important;
  max-width: 0;
  padding: 0;
  overflow: hidden;
}

/* ====== Footer ====== */
.app-footer {
  text-align: center;
  padding: 1rem 2rem;
  font-size: 0.75rem;
  color: #64748b;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.app-footer strong {
  color: #94a3b8;
}

.footer-dot {
  margin: 0 0.5rem;
}

/* ====== 滚动条 ====== */
.preview-panel::-webkit-scrollbar {
  width: 4px;
}

.preview-panel::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 999px;
}

.preview-panel::-webkit-scrollbar-track {
  background: transparent;
}

/* ====== 响应式 ====== */
@media (max-width: 900px) {
  .app-main {
    flex-direction: column;
    padding: 1rem;
  }

  .preview-panel {
    flex: none;
    width: 100%;
    max-height: 400px;
  }
}
</style>

<script setup lang="ts">
import TiptapEditor from "@myorg/tiptap-lib";
import { ref, computed, h, watch, onMounted, shallowRef, markRaw } from "vue";
import { 
  NConfigProvider, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, 
  NMenu, NSpace, NButton, NIcon, NText, NDivider, NCheckbox, NCheckboxGroup, NCard, NSwitch,
  darkTheme
} from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
import { 
  LogoGithub,
  BookOutline,
  CodeWorkingOutline,
  SunnyOutline,
  MoonOutline,
  InformationCircleOutline,
  SaveOutline,
  ColorPaletteOutline,
  ImageOutline,
  SettingsOutline
} from "@vicons/ionicons5";

// 导入 Markdown 文档组件 (需配置 vite-plugin-md 或类似插件)
import IntroDoc from "./docs/Intro.md";
import InstallDoc from "./docs/Install.md";
import ToolbarDoc from "./docs/Toolbar.md";
import ImagesDoc from "./docs/Images.md";
import ColorsDoc from "./docs/Colors.md";
import PersistenceDoc from "./docs/Persistence.md";

import { useImageUpload } from "./composables/useImageUpload";
import { DEFAULT_TOOLS } from "@myorg/tiptap-lib";

// --- 主题定制 ---
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3eaf7c',
    primaryColorHover: '#4abf8a',
  },
};

// --- 核心状态 ---
const isDark = ref(true);
const activeKey = ref('intro');
const currentTheme = computed(() => isDark.value ? darkTheme : null);

// 页面组件映射
const docComponents: Record<string, any> = {
  intro: markRaw(IntroDoc),
  install: markRaw(InstallDoc),
  toolbar: markRaw(ToolbarDoc),
  images: markRaw(ImagesDoc),
  colors: markRaw(ColorsDoc),
  persistence: markRaw(PersistenceDoc),
};

const activeDocComponent = computed(() => docComponents[activeKey.value]);

// 编辑器内容存储
const pageContents = ref<Record<string, string>>({
  intro: "<h1>Hello Tiptap!</h1><p>这是一个实时同步的编辑器实例。</p>",
  persistence: "<h1>持久化测试</h1><p>在这里输入内容...</p>",
});

const content = computed({
  get: () => pageContents.value[activeKey.value] || '',
  set: (val) => { pageContents.value[activeKey.value] = val; }
});

// --- 工具栏配置页面特有逻辑 ---
const selectedTools = ref([...DEFAULT_TOOLS]);

// --- 图片上传页面特有逻辑 ---
const { isReady: uploadReady, getExtension } = useImageUpload();
const extensions = computed(() => {
  const ext = getExtension();
  return (activeKey.value === 'images' && ext) ? [ext] : [];
});

// --- 持久化页面特有逻辑 ---
const autoSaveEnabled = ref(false);
const lastSaved = ref<string | null>(null);

watch(content, (newVal) => {
  if (activeKey.value === 'persistence' && autoSaveEnabled.value) {
    localStorage.setItem('tiptap_playground_save', newVal);
    lastSaved.value = new Date().toLocaleTimeString();
  }
});

onMounted(() => {
  const saved = localStorage.getItem('tiptap_playground_save');
  if (saved) {
    pageContents.value.persistence = saved;
  }
});

// --- 菜单配置 ---
const menuOptions = [
  {
    label: '入门指南',
    key: 'guide',
    type: 'group',
    children: [
      { label: '欢迎', key: 'intro', icon: () => h(NIcon, null, { default: () => h(InformationCircleOutline) }) },
      { label: '安装', key: 'install', icon: () => h(NIcon, null, { default: () => h(BookOutline) }) },
    ]
  },
  {
    label: '核心功能',
    key: 'core',
    type: 'group',
    children: [
      { label: '工具栏配置', key: 'toolbar', icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }) },
      { label: '图片上传', key: 'images', icon: () => h(NIcon, null, { default: () => h(ImageOutline) }) },
      { label: '文本颜色', key: 'colors', icon: () => h(NIcon, null, { default: () => h(ColorPaletteOutline) }) },
    ]
  },
  {
    label: '进阶扩展',
    key: 'advanced',
    type: 'group',
    children: [
      { label: '自动保存', key: 'persistence', icon: () => h(NIcon, null, { default: () => h(SaveOutline) }) },
    ]
  }
];

const handleMenuUpdate = (key: string) => {
  activeKey.value = key;
};
</script>

<template>
  <div :class="{ 'dark': isDark }">
    <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
      <div class="vp-app">
        <n-layout position="absolute" style="height: 100vh">
          <!-- Navbar -->
          <n-layout-header bordered class="vp-nav">
            <div class="vp-nav-container">
              <div class="vp-nav-logo" @click="activeKey = 'intro'">
                <img src="/favicon.png" alt="Logo" class="logo-img" />
                <span class="logo-text">Tiptap Docs</span>
              </div>
              <div class="vp-nav-content">
                <n-space :size="24" align="center">
                  <n-button quaternary circle @click="isDark = !isDark">
                    <template #icon><n-icon :component="isDark ? SunnyOutline : MoonOutline" /></template>
                  </n-button>
                  <n-button quaternary circle tag="a" href="https://github.com/wllcyg/my-tiptap-monorepo" target="_blank">
                    <template #icon><n-icon :component="LogoGithub" /></template>
                  </n-button>
                </n-space>
              </div>
            </div>
          </n-layout-header>

          <!-- Main Layout -->
          <n-layout has-sider position="absolute" style="top: 64px; bottom: 0">
            <n-layout-sider bordered :width="280" class="vp-sidebar">
              <div class="sidebar-inner">
                <n-menu
                  :options="menuOptions"
                  :value="activeKey"
                  @update:value="handleMenuUpdate"
                  class="vp-menu"
                />
              </div>
            </n-layout-sider>

            <n-layout-content :native-scrollbar="false" class="vp-content">
              <div class="content-container">
                <main class="main-body shadow-border">
                  <!-- Markdown 内容渲染区 -->
                  <div class="markdown-body prose dark:prose-invert max-w-none">
                    <component :is="activeDocComponent" v-if="activeDocComponent" />
                  </div>

                  <n-divider v-if="activeKey === 'intro'" />

                  <!-- 仅在欢迎页展示编辑器 -->
                  <div v-if="activeKey === 'intro'" class="intro-demo-section">
                    <n-text depth="3" class="demo-label">实时编辑器体验</n-text>
                    <div class="vp-editor-container" style="margin-top: 16px">
                      <TiptapEditor v-if="uploadReady" v-model="content" />
                    </div>
                  </div>

                  <!-- 文档页面的页脚链接 -->
                  <div class="page-footer-nav" style="margin-top: 60px">
                    <n-divider />
                    <n-space justify="space-between">
                      <n-button text>← 上一页</n-button>
                      <n-button text>下一页 →</n-button>
                    </n-space>
                  </div>
                </main>

                <footer class="vp-footer">
                  <p class="copyright">Copyright © 2024-present Tiptap Monorepo</p>
                </footer>
              </div>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </div>
    </n-config-provider>
  </div>
</template>

<style lang="scss" scoped>
.vp-app { background-color: var(--vp-c-bg); transition: background-color 0.3s; }
.vp-nav { 
  height: 64px; background-color: var(--vp-c-bg); z-index: 100;
  .vp-nav-container { max-width: 1400px; height: 100%; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; }
}
.vp-nav-logo { display: flex; align-items: center; gap: 12px; cursor: pointer;
  .logo-img { width: 24px; height: 24px; }
  .logo-text { font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); }
}
.vp-sidebar { background-color: var(--vp-c-bg); .sidebar-inner { padding: 32px 0; } }
.vp-content { background-color: var(--vp-c-bg); }
.content-container { display: flex; flex-direction: column; min-height: 100%; }
.main-body { 
  flex: 1; padding: 48px 48px 128px; max-width: 960px; margin: 40px auto; width: 100%; 
  background-color: var(--vp-c-bg);
  border-radius: 8px;
}

.demo-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }

:deep(.tiptap-normal-container) {
  background-color: transparent !important;
  border: 1px solid var(--vp-c-divider) !important;
  box-shadow: none !important;
  border-radius: 8px !important;
  .tiptap-toolbar-wrapper { background-color: var(--vp-c-bg-soft) !important; border-bottom: 1px solid var(--vp-c-divider) !important; padding: 6px 12px !important; }
  .tiptap-prosemirror { background-color: transparent !important; color: var(--vp-c-text-1) !important; padding: 32px 0 !important; }
}

/* Markdown 特有样式微调 */
.markdown-body {
  :deep(h1) { font-size: 2.25rem; margin-top: 0; }
  :deep(pre) { background-color: var(--vp-c-bg-mute); padding: 16px; border-radius: 8px; font-size: 0.9em; }
  :deep(code) { color: var(--vp-c-brand); }
}

.vp-footer { padding: 32px; border-top: 1px solid var(--vp-c-divider); .copyright { font-size: 12px; color: var(--vp-c-text-2); text-align: center; } }
</style>

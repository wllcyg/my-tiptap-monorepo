<template>
  <div class="image-upload-example">
    <div class="header">
      <h1>📸 图片上传功能演示</h1>
      <p class="subtitle">支持粘贴（Ctrl+V）和拖拽上传图片</p>
    </div>

    <div class="config-panel">
      <h3>配置选项</h3>
      <div class="config-options">
        <label>
          <input type="radio" v-model="provider" value="cos" />
          腾讯云 COS
        </label>
        <label>
          <input type="radio" v-model="provider" value="oss" />
          阿里云 OSS
        </label>
        <label>
          <input type="radio" v-model="provider" value="mock" />
          模拟上传（演示）
        </label>
      </div>

      <div v-if="provider === 'cos'" class="config-form">
        <input v-model="cosConfig.Bucket" placeholder="Bucket (例: my-bucket-1234567890)" />
        <input v-model="cosConfig.Region" placeholder="Region (例: ap-guangzhou)" />
        <input v-model="cosConfig.Prefix" placeholder="Prefix (可选，例: images)" />
      </div>

      <div v-if="provider === 'oss'" class="config-form">
        <input v-model="ossConfig.bucket" placeholder="Bucket (例: my-bucket)" />
        <input v-model="ossConfig.region" placeholder="Region (例: oss-cn-hangzhou)" />
        <input v-model="ossConfig.prefix" placeholder="Prefix (可选，例: images)" />
      </div>

      <button @click="initializeUploader" class="init-btn">
        {{ uploaderReady ? '✅ 上传器已就绪' : '初始化上传器' }}
      </button>
    </div>

    <div class="editor-section">
      <div class="tips">
        <strong>💡 使用提示：</strong>
        <ul>
          <li>粘贴图片：复制图片后按 Ctrl+V (Windows) 或 Cmd+V (Mac)</li>
          <li>拖拽图片：直接将图片文件拖到编辑器中</li>
          <li>多图上传：可以同时粘贴或拖拽多张图片</li>
        </ul>
      </div>

      <TiptapEditor 
        v-if="uploaderReady"
        v-model="content" 
        :extensions="extensions"
        :editable="true"
        :auto-focus="true"
      />
      <div v-else class="placeholder">
        <p>⚠️ 请先配置并初始化上传器</p>
      </div>
    </div>

    <div class="output-section">
      <h3>HTML 输出</h3>
      <pre><code>{{ content }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { TiptapEditor, ImageUpload, UploaderFactory } from '@myorg/tiptap-lib';
import type { Uploader, UploaderOptions, UploadResult } from '@myorg/tiptap-lib';

const content = ref('<p>在这里粘贴或拖拽图片试试！</p>');
const provider = ref<'cos' | 'oss' | 'mock'>('mock');
const uploaderReady = ref(false);

// COS 配置
const cosConfig = ref({
  Bucket: '',
  Region: 'ap-guangzhou',
  Prefix: 'editor-images',
});

// OSS 配置
const ossConfig = ref({
  bucket: '',
  region: 'oss-cn-hangzhou',
  prefix: 'editor-images',
});

// 模拟上传器（用于演示）
class MockUploader implements Uploader {
  async upload(file: File, options?: UploaderOptions): Promise<UploadResult> {
    console.log('📤 模拟上传:', file.name, file.size, 'bytes');
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟进度回调
    if (options?.onProgress) {
      options.onProgress({ percent: 50, loaded: file.size / 2, total: file.size });
      await new Promise(resolve => setTimeout(resolve, 500));
      options.onProgress({ percent: 100, loaded: file.size, total: file.size });
    }
    
    // 将图片转为 base64 URL（实际项目中应该是云端 URL）
    const url = await fileToBase64(file);
    
    console.log('✅ 上传成功');
    
    return {
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }
}

// 文件转 base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 当前上传器实例
let currentUploader: Uploader | null = null;

// 初始化上传器
function initializeUploader() {
  try {
    if (provider.value === 'mock') {
      currentUploader = new MockUploader();
      uploaderReady.value = true;
      alert('✅ 模拟上传器已就绪！\n\n现在可以粘贴或拖拽图片到编辑器了。\n图片将转为 base64 显示（实际项目中会上传到云端）。');
      return;
    }

    if (provider.value === 'cos') {
      if (!cosConfig.value.Bucket) {
        alert('❌ 请填写 COS Bucket 名称');
        return;
      }
      
      // 实际项目中需要先初始化 COS SDK
      alert('⚠️ 实际使用需要先安装并初始化 COS SDK\n\n请参考文档：packages/tiptap-lib/IMAGE_UPLOAD_GUIDE.md');
      return;
    }

    if (provider.value === 'oss') {
      if (!ossConfig.value.bucket) {
        alert('❌ 请填写 OSS Bucket 名称');
        return;
      }
      
      // 实际项目中需要先初始化 OSS SDK
      alert('⚠️ 实际使用需要先安装并初始化 OSS SDK\n\n请参考文档：packages/tiptap-lib/IMAGE_UPLOAD_GUIDE.md');
      return;
    }
  } catch (error) {
    console.error('初始化上传器失败:', error);
    alert('❌ 初始化失败: ' + (error as Error).message);
  }
}

// 配置扩展
const extensions = computed(() => {
  if (!currentUploader) return [];
  
  return [
    ImageUpload.configure({ 
      uploader: currentUploader 
    })
  ];
});
</script>

<style scoped>
.image-upload-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
}

.config-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.config-panel h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #334155;
}

.config-options {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.config-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.config-options input[type="radio"] {
  cursor: pointer;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.config-form input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}

.config-form input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.init-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.init-btn:hover {
  background: #2563eb;
}

.editor-section {
  margin-bottom: 2rem;
}

.tips {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.tips strong {
  color: #1e40af;
}

.tips ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.tips li {
  margin: 0.25rem 0;
  color: #1e40af;
}

.placeholder {
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.output-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
}

.output-section h3 {
  color: #f1f5f9;
  margin-top: 0;
  margin-bottom: 1rem;
}

.output-section pre {
  margin: 0;
  overflow-x: auto;
}

.output-section code {
  color: #94a3b8;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .image-upload-example {
    padding: 1rem;
  }

  .config-options {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>

# 📸 图片上传功能使用指南

## 目录
- [快速开始](#快速开始)
- [使用腾讯云 COS](#使用腾讯云-cos)
- [使用阿里云 OSS](#使用阿里云-oss)
- [自定义上传器](#自定义上传器)
- [进阶配置](#进阶配置)
- [完整示例](#完整示例)

---

## 快速开始

图片上传功能支持：
- ✅ 粘贴图片（Ctrl+V / Cmd+V）
- ✅ 拖拽图片到编辑器
- ✅ 多图片同时上传
- ✅ 上传进度回调
- ✅ 支持腾讯云 COS、阿里云 OSS

---

## 使用腾讯云 COS

### 1. 安装依赖

```bash
pnpm add cos-js-sdk-v5
```

### 2. 初始化 COS SDK

```typescript
import COS from 'cos-js-sdk-v5';

// 方式一：使用临时密钥（推荐，更安全）
const cos = new COS({
  getAuthorization: async (options, callback) => {
    // 从后端获取临时密钥
    const response = await fetch('/api/sts-token');
    const data = await response.json();
    
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      ExpiredTime: data.expiredTime,
    });
  }
});

// 方式二：直接使用密钥（仅用于开发测试）
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID',
  SecretKey: 'YOUR_SECRET_KEY',
});
```

### 3. 创建上传器并配置编辑器

```vue
<template>
  <TiptapEditor 
    v-model="content" 
    :extensions="extensions"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TiptapEditor, ImageUpload, UploaderFactory } from '@myorg/tiptap-lib';
import COS from 'cos-js-sdk-v5';

const content = ref('<p>开始编辑...</p>');

// 1. 初始化 COS
const cos = new COS({
  getAuthorization: async (options, callback) => {
    const response = await fetch('/api/sts-token');
    const data = await response.json();
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      ExpiredTime: data.expiredTime,
    });
  }
});

// 2. 创建上传器
const uploader = UploaderFactory.create('cos', {
  Bucket: 'my-bucket-1234567890',  // 存储桶名称
  Region: 'ap-guangzhou',          // 地域
  Prefix: 'editor-images',         // 上传目录（可选）
  cosInstance: cos,
});

// 3. 配置扩展
const extensions = [
  ImageUpload.configure({ uploader })
];
</script>
```

### 4. 后端 STS 临时密钥接口示例（Node.js）

```javascript
// 安装：npm install qcloud-cos-sts
const STS = require('qcloud-cos-sts');

app.get('/api/sts-token', async (req, res) => {
  const policy = {
    version: '2.0',
    statement: [{
      action: ['name/cos:PutObject'],
      effect: 'allow',
      resource: ['qcs::cos:ap-guangzhou:uid/1234567890:my-bucket-1234567890/*'],
    }],
  };

  const config = {
    secretId: process.env.COS_SECRET_ID,
    secretKey: process.env.COS_SECRET_KEY,
    durationSeconds: 1800,
    policy: policy,
  };

  try {
    const data = await STS.getCredential(config);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 使用阿里云 OSS

### 1. 安装依赖

```bash
pnpm add ali-oss
```

### 2. 初始化 OSS SDK

```typescript
import OSS from 'ali-oss';

// 方式一：使用 STS 临时凭证（推荐）
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
  stsToken: 'YOUR_STS_TOKEN',
  bucket: 'my-bucket',
});

// 方式二：直接使用 AccessKey（仅用于开发测试）
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
  bucket: 'my-bucket',
});
```

### 3. 创建上传器并配置编辑器

```vue
<template>
  <TiptapEditor 
    v-model="content" 
    :extensions="extensions"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TiptapEditor, ImageUpload, UploaderFactory } from '@myorg/tiptap-lib';
import OSS from 'ali-oss';

const content = ref('<p>开始编辑...</p>');

// 1. 初始化 OSS
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
  bucket: 'my-bucket',
});

// 2. 创建上传器
const uploader = UploaderFactory.create('oss', {
  bucket: 'my-bucket',
  region: 'oss-cn-hangzhou',
  prefix: 'editor-images',  // 上传目录（可选）
  ossInstance: client,
});

// 3. 配置扩展
const extensions = [
  ImageUpload.configure({ uploader })
];
</script>
```

---

## 自定义上传器

如果你使用其他云服务（如七牛云、AWS S3），可以实现自定义上传器：

```typescript
import type { Uploader, UploaderOptions, UploadResult } from '@myorg/tiptap-lib';

class QiniuUploader implements Uploader {
  private token: string;
  private domain: string;

  constructor(token: string, domain: string) {
    this.token = token;
    this.domain = domain;
  }

  async upload(file: File, options?: UploaderOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', this.token);

    const response = await fetch('https://upload.qiniup.com', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    return {
      url: `${this.domain}/${data.key}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }
}

// 使用自定义上传器
const uploader = new QiniuUploader('YOUR_TOKEN', 'https://cdn.example.com');
const extensions = [ImageUpload.configure({ uploader })];
```

---

## 进阶配置

### 1. 监听上传进度

```typescript
const uploader = UploaderFactory.create('cos', {
  Bucket: 'my-bucket-1234567890',
  Region: 'ap-guangzhou',
  cosInstance: cos,
});

// 注意：进度回调需要在上传时传入，但当前 ImageUpload 扩展内部没有暴露
// 如需进度显示，需要修改扩展代码或直接调用 uploader.upload()
```

### 2. 自定义文件名

```typescript
// 当前扩展使用时间戳命名：`${Date.now()}-${file.name}`
// 如需自定义，可以修改扩展代码中的 uploadAndInsertImage 函数
```

### 3. 文件校验

建议在上传前添加文件校验：

```typescript
function validateImage(file: File): boolean {
  // 限制文件大小（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('图片大小不能超过 5MB');
    return false;
  }

  // 限制文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('只支持 JPG、PNG、GIF、WebP 格式');
    return false;
  }

  return true;
}
```

---

## 完整示例

### Vue 3 + TypeScript + 腾讯云 COS

```vue
<template>
  <div class="editor-container">
    <h1>富文本编辑器 - 图片上传示例</h1>
    
    <TiptapEditor 
      v-model="content" 
      :extensions="extensions"
      :editable="true"
      :auto-focus="true"
    />

    <div class="preview">
      <h2>预览</h2>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TiptapEditor, ImageUpload, UploaderFactory } from '@myorg/tiptap-lib';
import COS from 'cos-js-sdk-v5';

const content = ref('<p>试试粘贴或拖拽图片到编辑器！</p>');

// COS 配置
const COS_CONFIG = {
  Bucket: 'my-bucket-1234567890',
  Region: 'ap-guangzhou',
  Prefix: 'editor-images',
};

// 初始化 COS
const cos = new COS({
  getAuthorization: async (options, callback) => {
    try {
      const response = await fetch('/api/sts-token');
      const data = await response.json();
      
      callback({
        TmpSecretId: data.credentials.tmpSecretId,
        TmpSecretKey: data.credentials.tmpSecretKey,
        SecurityToken: data.credentials.sessionToken,
        ExpiredTime: data.expiredTime,
      });
    } catch (error) {
      console.error('获取临时密钥失败:', error);
    }
  }
});

// 创建上传器
const uploader = UploaderFactory.create('cos', {
  ...COS_CONFIG,
  cosInstance: cos,
});

// 配置扩展
const extensions = [
  ImageUpload.configure({ uploader })
];

onMounted(() => {
  console.log('编辑器已加载，支持图片上传功能');
});
</script>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.preview {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
```

---

## 常见问题

### Q1: 图片上传失败怎么办？

**检查清单：**
1. 确认 COS/OSS SDK 已正确安装
2. 检查存储桶配置（Bucket、Region）是否正确
3. 确认临时密钥接口返回正常
4. 查看浏览器控制台错误信息
5. 检查存储桶 CORS 配置

### Q2: 如何配置 CORS？

**腾讯云 COS：**
```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["PUT", "POST", "GET"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

**阿里云 OSS：**
```xml
<CORSRule>
  <AllowedOrigin>*</AllowedOrigin>
  <AllowedMethod>PUT</AllowedMethod>
  <AllowedMethod>POST</AllowedMethod>
  <AllowedMethod>GET</AllowedMethod>
  <AllowedHeader>*</AllowedHeader>
</CORSRule>
```

### Q3: 如何显示上传进度？

当前扩展内部没有暴露进度回调，需要修改 `image-upload.ts` 中的 `uploadAndInsertImage` 函数，添加进度处理逻辑。

### Q4: 支持哪些图片格式？

默认支持所有 `image/*` MIME 类型，包括：
- image/jpeg
- image/png
- image/gif
- image/webp
- image/svg+xml

---

## 技术支持

如有问题，请查看：
- [Tiptap 官方文档](https://tiptap.dev/)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)

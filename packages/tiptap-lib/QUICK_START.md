# 🚀 图片上传功能快速开始

## 三步集成图片上传

### 步骤 1：安装云服务 SDK

```bash
# 腾讯云 COS
pnpm add cos-js-sdk-v5

# 或者阿里云 OSS
pnpm add ali-oss
```

### 步骤 2：创建上传器

```typescript
import { UploaderFactory } from '@myorg/tiptap-lib';
import COS from 'cos-js-sdk-v5';

// 初始化 COS
const cos = new COS({
  SecretId: 'YOUR_SECRET_ID',
  SecretKey: 'YOUR_SECRET_KEY',
});

// 创建上传器
const uploader = UploaderFactory.create('cos', {
  Bucket: 'my-bucket-1234567890',
  Region: 'ap-guangzhou',
  Prefix: 'images',
  cosInstance: cos,
});
```

### 步骤 3：配置编辑器

```vue
<template>
  <TiptapEditor 
    v-model="content" 
    :extensions="extensions"
  />
</template>

<script setup>
import { ImageUpload } from '@myorg/tiptap-lib';

const extensions = [
  ImageUpload.configure({ uploader })
];
</script>
```

## 完成！🎉

现在你可以：
- 复制图片后按 `Ctrl+V` 粘贴到编辑器
- 拖拽图片文件到编辑器
- 同时上传多张图片

## 详细文档

查看完整文档：[IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md)

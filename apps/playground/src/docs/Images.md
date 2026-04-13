# 图片上传 (Images)

本架构提供了强大的图片上传工作流支持，集成了 **腾讯云 COS** 和 **阿里云 OSS**。

## 1. 核心扩展
使用 `createImageUploadExtension` 函数配合上传器实例即可开启图片上传逻辑。

```typescript
import { TiptapEditor, createImageUploadExtension, UploaderFactory } from '@myorg/tiptap-lib'

// 创建上传器实例
const uploader = UploaderFactory.create('cos', {
  Bucket: 'my-bucket',
  Region: 'ap-guangzhou',
  // ... 其他配置
})

// 注册扩展
const extensions = [
  createImageUploadExtension(uploader)
]
```

## 2. 交互方式
- **拖拽上传**: 将图片直接拖入编辑器
- **粘贴上传**: 从剪贴板粘贴截图或图片
- **多图支持**: 同时处理多张图片的上传任务

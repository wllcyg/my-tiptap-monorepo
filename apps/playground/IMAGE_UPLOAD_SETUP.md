# 📸 Playground 图片上传功能说明

## 当前状态

✅ 已集成图片上传功能，使用腾讯云 COS 临时密钥方式

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量（可选）

如果要使用真实的 COS 服务：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，填入你的 COS 配置
VITE_COS_BUCKET=your-bucket-1234567890
VITE_COS_REGION=ap-guangzhou
VITE_COS_PREFIX=editor-images
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 使用图片上传

打开浏览器访问 http://localhost:5173

- **粘贴上传**：复制图片后按 `Ctrl+V` (Windows) 或 `Cmd+V` (Mac)
- **拖拽上传**：直接将图片文件拖到编辑器中
- **多图上传**：可以同时粘贴或拖拽多张图片

## 当前实现

### 架构说明

```
App.vue
  ↓ 使用
useImageUpload (composable)
  ↓ 初始化
COS SDK + UploaderFactory
  ↓ 创建
ImageUpload Extension
  ↓ 配置
TiptapEditor
```

### 文件结构

```
apps/playground/
├── src/
│   ├── App.vue                          # 主应用（已集成图片上传）
│   ├── composables/
│   │   └── useImageUpload.ts            # 图片上传 Composable
│   └── services/
│       └── sts-mock.ts                  # STS 临时密钥服务（模拟）
├── .env.example                         # 环境变量模板
├── .env.local                           # 本地环境变量（不提交到 Git）
└── IMAGE_UPLOAD_SETUP.md                # 本文档
```

### 核心代码

#### useImageUpload.ts

负责：
- 初始化 COS SDK
- 获取临时密钥
- 创建上传器
- 返回 Tiptap 扩展

#### sts-mock.ts

提供：
- 模拟的 STS 临时密钥服务
- COS 配置管理
- 真实后端接口示例代码

## 模拟模式 vs 真实模式

### 当前：模拟模式（默认）

- ✅ 无需配置，开箱即用
- ✅ 适合本地开发和演示
- ⚠️ 使用模拟的临时密钥（不会真实上传）
- ⚠️ 图片会转为 base64 显示

### 切换到真实模式

需要：

1. **配置 COS 存储桶**
   - 登录腾讯云控制台
   - 创建 COS 存储桶
   - 配置 CORS 规则

2. **实现后端 STS 接口**
   
   安装依赖：
   ```bash
   npm install qcloud-cos-sts
   ```

   创建接口（Node.js 示例）：
   ```javascript
   const express = require('express');
   const STS = require('qcloud-cos-sts');
   
   const app = express();
   
   app.get('/api/sts-token', async (req, res) => {
     const policy = {
       version: '2.0',
       statement: [{
         action: ['name/cos:PutObject'],
         effect: 'allow',
         resource: ['qcs::cos:ap-guangzhou:uid/1234567890:my-bucket/*'],
       }],
     };
   
     const config = {
       secretId: process.env.COS_SECRET_ID,
       secretKey: process.env.COS_SECRET_KEY,
       durationSeconds: 1800,
       policy: policy,
     };
   
     const data = await STS.getCredential(config);
     res.json(data);
   });
   
   app.listen(3000);
   ```

3. **修改前端代码**

   在 `useImageUpload.ts` 中：
   ```typescript
   // 替换模拟接口为真实接口
   const data = await getMockSTSToken();
   // 改为
   const response = await fetch('/api/sts-token');
   const data = await response.json();
   ```

4. **配置环境变量**
   
   编辑 `.env.local`：
   ```
   VITE_COS_BUCKET=your-real-bucket-1234567890
   VITE_COS_REGION=ap-guangzhou
   VITE_COS_PREFIX=editor-images
   ```

## COS CORS 配置

在腾讯云 COS 控制台配置 CORS 规则：

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["PUT", "POST", "GET"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag", "Content-Length"],
  "MaxAgeSeconds": 3600
}
```

或使用更严格的配置：

```json
{
  "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
  "AllowedMethods": ["PUT", "POST"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

## 安全建议

### ⚠️ 不要做的事

1. ❌ 不要在前端代码中硬编码 SecretId 和 SecretKey
2. ❌ 不要将 .env.local 提交到 Git
3. ❌ 不要在生产环境使用模拟的 STS 服务

### ✅ 应该做的事

1. ✅ 使用临时密钥（STS）方式
2. ✅ 在后端实现 STS 接口
3. ✅ 使用环境变量管理配置
4. ✅ 配置合理的 CORS 规则
5. ✅ 限制临时密钥的权限范围
6. ✅ 设置合理的密钥过期时间（如 30 分钟）

## 调试

### 查看控制台日志

打开浏览器开发者工具（F12），查看 Console 标签：

```
🚀 初始化图片上传功能...
📦 COS 配置: { Bucket: '...', Region: '...', Prefix: '...' }
🔑 获取临时密钥...
✅ 临时密钥获取成功
⏰ 过期时间: 2024-01-01 12:30:00
✅ 图片上传功能初始化完成
💡 现在可以粘贴（Ctrl+V）或拖拽图片到编辑器了
```

### 常见问题

**Q: 图片上传失败？**

检查：
1. COS 配置是否正确
2. CORS 规则是否配置
3. 临时密钥是否有效
4. 网络连接是否正常

**Q: 看不到上传的图片？**

- 模拟模式：图片会转为 base64，可以正常显示
- 真实模式：检查返回的 URL 是否可访问

**Q: 如何查看上传进度？**

当前版本暂不支持进度显示，可以在控制台查看上传日志。

## 下一步优化

- [ ] 添加上传进度显示
- [ ] 添加文件大小和格式校验
- [ ] 添加上传失败重试机制
- [ ] 支持图片压缩
- [ ] 支持自定义文件命名规则

## 参考文档

- [Tiptap 官方文档](https://tiptap.dev/)
- [腾讯云 COS 文档](https://cloud.tencent.com/document/product/436)
- [COS JavaScript SDK](https://cloud.tencent.com/document/product/436/11459)
- [STS 临时密钥](https://cloud.tencent.com/document/product/436/14048)

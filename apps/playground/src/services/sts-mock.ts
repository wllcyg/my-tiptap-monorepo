/**
 * 模拟 STS 临时密钥服务
 * 
 * ⚠️ 注意：这是演示代码，实际项目中应该：
 * 1. 在后端实现 STS 接口
 * 2. 使用环境变量存储密钥
 * 3. 添加权限控制和安全验证
 */

export interface STSCredentials {
  tmpSecretId: string;
  tmpSecretKey: string;
  sessionToken: string;
  expiredTime: number;
}

export interface STSResponse {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  expiredTime: number;
  expiration: string;
  requestId: string;
}

/**
 * 模拟获取 COS 临时密钥
 * 
 * 实际项目中应该调用后端接口：
 * const response = await fetch('/api/sts-token');
 * return response.json();
 */
export async function getMockSTSToken(): Promise<STSResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 模拟返回临时密钥（实际项目中从后端获取）
  const now = Date.now();
  const expiredTime = Math.floor(now / 1000) + 1800; // 30分钟后过期

  return {
    credentials: {
      tmpSecretId: 'MOCK_TMP_SECRET_ID_' + now,
      tmpSecretKey: 'MOCK_TMP_SECRET_KEY_' + now,
      sessionToken: 'MOCK_SESSION_TOKEN_' + now,
    },
    expiredTime,
    expiration: new Date(now + 1800000).toISOString(),
    requestId: 'mock-request-id-' + now,
  };
}

/**
 * 真实的后端接口示例（Node.js + Express）
 * 
 * 需要安装：npm install qcloud-cos-sts
 * 
 * ```javascript
 * const express = require('express');
 * const STS = require('qcloud-cos-sts');
 * 
 * const app = express();
 * 
 * app.get('/api/sts-token', async (req, res) => {
 *   try {
 *     const policy = {
 *       version: '2.0',
 *       statement: [{
 *         action: [
 *           'name/cos:PutObject',
 *           'name/cos:PostObject',
 *           'name/cos:InitiateMultipartUpload',
 *           'name/cos:ListMultipartUploads',
 *           'name/cos:ListParts',
 *           'name/cos:UploadPart',
 *           'name/cos:CompleteMultipartUpload'
 *         ],
 *         effect: 'allow',
 *         resource: [
 *           'qcs::cos:ap-guangzhou:uid/1234567890:my-bucket-1234567890/*'
 *         ],
 *       }],
 *     };
 * 
 *     const config = {
 *       secretId: process.env.COS_SECRET_ID,
 *       secretKey: process.env.COS_SECRET_KEY,
 *       durationSeconds: 1800,
 *       policy: policy,
 *     };
 * 
 *     const data = await STS.getCredential(config);
 *     res.json(data);
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 * 
 * app.listen(3000);
 * ```
 */

/**
 * COS 配置说明
 */
export const COS_CONFIG = {
  // 存储桶名称，格式：BucketName-APPID
  // 示例：'my-bucket-1234567890'
  Bucket: import.meta.env.VITE_COS_BUCKET || 'wll-1258475753',

  // 存储桶所在地域
  // 可选值：ap-beijing, ap-shanghai, ap-guangzhou, ap-chengdu 等
  Region: import.meta.env.VITE_COS_REGION || 'ap-guangzhou',

  // 上传文件的目录前缀（可选）
  Prefix: import.meta.env.VITE_COS_PREFIX || 'editor-images',
};

/**
 * 环境变量配置说明
 * 
 * 在项目根目录创建 .env.local 文件：
 * 
 * ```
 * VITE_COS_BUCKET=your-bucket-1234567890
 * VITE_COS_REGION=ap-guangzhou
 * VITE_COS_PREFIX=editor-images
 * ```
 */

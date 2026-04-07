import { ref, onMounted } from 'vue';
import COS from 'cos-js-sdk-v5';
import { UploaderFactory, createImageUploadExtension } from '@myorg/tiptap-lib';
import type { Uploader } from '@myorg/tiptap-lib';
import { COS_CONFIG } from '../services/sts-mock';

/**
 * 图片上传 Composable
 * 
 * 功能：
 * - 初始化 COS SDK
 * - 创建上传器
 * - 返回基于 FileHandler 的 Tiptap 扩展
 */
export function useImageUpload() {
  const uploader = ref<Uploader | null>(null);
  const isReady = ref(false);
  const error = ref<string | null>(null);

  /**
   * 初始化 COS 和上传器
   */
  async function initialize() {
    try {
      console.log('🚀 初始化图片上传功能...');
      console.log('📦 COS 配置:', COS_CONFIG);

      // 1. 创建 COS 实例
      const cosOptions: any = {};

      // 优先从环境变量读取真实密钥（仅用于开发测试）
      const secretId = import.meta.env.VITE_COS_SECRET_ID;
      const secretKey = import.meta.env.VITE_COS_SECRET_KEY;

      if (secretId && secretKey) {
        console.log('🔑 使用环境变量中的 SecretId 进行初始化');
        cosOptions.SecretId = secretId;
        cosOptions.SecretKey = secretKey;
      } else {
        // 使用临时密钥方式（推荐）
        console.log('🔑 未发现真实密钥，将从真实后端获取临时密钥...');
        cosOptions.getAuthorization = async (_options: any, callback: any) => {
          try {
            console.log('🔑 获取临时密钥...');
            const res = await fetch('https://1258475753-fq2a4nc48v.ap-guangzhou.tencentscf.com/token');
            const data = await res.json();
            const credentials = data.Response.Credentials;
            console.log('🔑 获取临时密钥...', credentials);

            callback({
              TmpSecretId: credentials.TmpSecretId,
              TmpSecretKey: credentials.TmpSecretKey,
              SecurityToken: credentials.Token,
              // 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
              // 如果后端接口没返回 StartTime，我们尝试取当前时间或从 ExpiredTime 倒推（一般有效期 30-60 分钟）
              StartTime: data.Response.StartTime || Math.floor(Date.now() / 1000),
              ExpiredTime: data.Response.ExpiredTime,
              ScopeLimit: true, // 细粒度控制权限，设为 true 会限制密钥只在相同请求时重复使用
            });
          } catch (err) {
            console.error('❌ 获取临时密钥失败:', err);
            callback({
              TmpSecretId: '',
              TmpSecretKey: '',
              SecurityToken: '',
              ExpiredTime: 0,
            });
          }
        };
      }

      const cos = new COS(cosOptions);

      // 2. 创建上传器
      uploader.value = UploaderFactory.create('cos', {
        Bucket: COS_CONFIG.Bucket,
        Region: COS_CONFIG.Region,
        Prefix: COS_CONFIG.Prefix,
        cosInstance: cos,
      });

      isReady.value = true;
      error.value = null;

      console.log('✅ 图片上传功能初始化完成');
      console.log('💡 现在可以粘贴（Ctrl+V）或拖拽图片到编辑器了');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      error.value = errorMessage;
      isReady.value = false;
      console.error('❌ 初始化失败:', errorMessage);
    }
  }

  /**
   * 获取基于 FileHandler 的 Tiptap 图片上传扩展
   */
  function getExtension() {
    if (!uploader.value) {
      console.warn('⚠️ 上传器未初始化');
      return null;
    }

    return createImageUploadExtension(uploader.value);
  }

  // 自动初始化
  onMounted(() => {
    initialize();
  });

  return {
    uploader,
    isReady,
    error,
    initialize,
    getExtension,
  };
}

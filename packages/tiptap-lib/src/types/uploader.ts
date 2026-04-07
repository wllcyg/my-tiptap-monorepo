/**
 * 统一上传器接口定义
 */
export interface UploadResult {
  url: string;
  name?: string;
  size?: number;
  type?: string;
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export type OnProgress = (progress: UploadProgress) => void;

export interface UploaderOptions {
  onProgress?: OnProgress;
  // 其他通用配置，如自定义文件名等
  fileName?: string;
}

export interface Uploader {
  /**
   * 上传文件
   * @param file 文件对象
   * @param options 上传配置
   */
  upload(file: File, options?: UploaderOptions): Promise<UploadResult>;
}

/**
 * 腾讯云 COS 配置
 */
export interface COSConfig {
  /** 存储桶名称，格式：BucketName-APPID */
  Bucket: string;
  /** 存储桶所在地域 */
  Region: string;
  /** 可选：前缀（目录） */
  Prefix?: string;
  /** 获取临时密钥的回调或密钥对象 */
  SecretId?: string;
  SecretKey?: string;
  SecurityToken?: string;
  /** 获取临时密钥的回调函数 */
  getAuthorization?: (options: any, callback: (data: any) => void) => void | Promise<void>;
  /** 如果使用 SDK 实例，则直接传入 */
  cosInstance?: any;
}

/**
 * 阿里云 OSS 配置
 */
export interface OSSConfig {
  /** 存储桶名称 */
  bucket: string;
  /** 地域，如 oss-cn-hangzhou */
  region: string;
  /** 访问域名（可选） */
  endpoint?: string;
  /** 可选：前缀（目录） */
  prefix?: string;
  /** 获取临时密钥的回调或密钥对象 */
  accessKeyId?: string;
  accessKeySecret?: string;
  stsToken?: string;
  /** 如果使用 SDK 实例，则直接传入 */
  ossInstance?: any;
}

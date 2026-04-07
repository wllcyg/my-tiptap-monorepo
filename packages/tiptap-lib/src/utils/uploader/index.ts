import type { Uploader, COSConfig, OSSConfig, UploadResult, UploadProgress, OnProgress, UploaderOptions } from "../../types/uploader";
export type { Uploader, COSConfig, OSSConfig, UploadResult, UploadProgress, OnProgress, UploaderOptions };
import { COSUploader } from "./adapters/cos";
import { OSSUploader } from "./adapters/oss";

export type ProviderType = "cos" | "oss";

/**
 * 上传器工厂类
 */
export class UploaderFactory {
  /**
   * 创建上传器实例
   * @param type 平台类型
   * @param config 对应平台的配置
   */
  static create(type: ProviderType, config: any): Uploader {
    switch (type) {
      case "cos":
        return new COSUploader(config as COSConfig);
      case "oss":
        return new OSSUploader(config as OSSConfig);
      default:
        throw new Error(`Unsupported uploader type: ${type}`);
    }
  }
}

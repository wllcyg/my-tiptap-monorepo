import COS from "cos-js-sdk-v5";
import type { COSConfig, Uploader, UploaderOptions, UploadResult } from "../../../types/uploader";

/**
 * 腾讯云 COS 上传适配器
 * 支持直接通过 SDK 实例上传，或配置基础信息。
 */
export class COSUploader implements Uploader {
  private cos: any;
  private config: COSConfig;

  constructor(config: COSConfig) {
    this.config = config;
    
    if (config.cosInstance) {
      this.cos = config.cosInstance;
    } else {
      // 尝试自动初始化
      const cosOptions: any = {};
      if (config.getAuthorization) {
        cosOptions.getAuthorization = config.getAuthorization;
      } else if (config.SecretId && config.SecretKey) {
        cosOptions.SecretId = config.SecretId;
        cosOptions.SecretKey = config.SecretKey;
        if (config.SecurityToken) {
          cosOptions.SecurityToken = config.SecurityToken;
        }
      }

      if (Object.keys(cosOptions).length > 0) {
        this.cos = new COS(cosOptions);
      } else {
        console.warn("COSUploader: No COS instance or credentials provided. Please ensure parameters are correct.");
      }
    }
  }

  async upload(file: File, options?: UploaderOptions): Promise<UploadResult> {
    if (!this.cos) {
      throw new Error("COS SDK instance is required for uploading.");
    }

    const { Bucket, Region, Prefix = "" } = this.config;
    const fileName = options?.fileName || `${Date.now()}-${file.name}`;
    const Key = Prefix ? `${Prefix.replace(/\/$/, "")}/${fileName}` : fileName;

    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket,
          Region,
          Key,
          Body: file,
          Headers: {
            "x-cos-acl": "public-read",
          },
          onProgress: (progressData: any) => {
            if (options?.onProgress) {
              options.onProgress({
                percent: Math.floor(progressData.percent * 100),
                loaded: progressData.loaded,
                total: progressData.total,
              });
            }
          },
        },
        (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            // 注意：data.Location 可能不带协议头，或者需要根据场景拼凑完整的 URL
            const protocol = window.location.protocol === "https:" ? "https://" : "http://";
            const url = data.Location.startsWith("http") 
              ? data.Location 
              : `${protocol}${data.Location}`;
            
            resolve({
              url,
              name: fileName,
              size: file.size,
              type: file.type,
            });
          }
        }
      );
    });
  }
}

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
    this.cos = config.cosInstance;
    
    if (!this.cos) {
      console.warn("COSUploader: No COS instance provided. Please ensure 'cos-js-sdk-v5' is available or passed in.");
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

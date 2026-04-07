import type { Uploader, UploaderOptions, UploadResult, OSSConfig } from "../../../types/uploader";

/**
 * 阿里云 OSS 上传适配器
 */
export class OSSUploader implements Uploader {
  private client: any;
  private config: OSSConfig;

  constructor(config: OSSConfig) {
    this.config = config;
    this.client = config.ossInstance;

    if (!this.client) {
      console.warn("OSSUploader: No OSS instance provided. Please ensure 'ali-oss' is available or passed in.");
    }
  }

  async upload(file: File, options?: UploaderOptions): Promise<UploadResult> {
    if (!this.client) {
      throw new Error("OSS SDK instance is required for uploading.");
    }

    const { prefix = "" } = this.config;
    const fileName = options?.fileName || `${Date.now()}-${file.name}`;
    const name = prefix ? `${prefix.replace(/\/$/, "")}/${fileName}` : fileName;

    try {
      const result = await this.client.put(name, file, {
        progress: (p: number) => {
          if (options?.onProgress) {
            options.onProgress({
              percent: Math.floor(p * 100),
              loaded: Math.floor(p * file.size),
              total: file.size,
            });
          }
        },
      });

      return {
        url: result.url,
        name: fileName,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error("OSS upload error:", error);
      throw error;
    }
  }
}

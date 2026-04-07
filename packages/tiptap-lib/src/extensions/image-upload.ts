import { FileHandler } from "@tiptap/extension-file-handler";
import type { Uploader } from "../types/uploader";

/**
 * 创建基于 FileHandler 的图片上传扩展
 *
 * 使用 @tiptap/extension-file-handler 拦截拖拽和粘贴事件，
 * 自动调用 uploader 上传图片文件并插入到编辑器中。
 *
 * @param uploader - 统一上传器实例
 */
export function createImageUploadExtension(uploader: Uploader) {
  return FileHandler.configure({
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ],
    onDrop: (currentEditor, files, pos) => {
      console.log("onDrop", currentEditor, files, pos);
      const images = files.filter((file) => file.type.startsWith("image/"));
      images.forEach((file) => {
        uploadAndInsert(currentEditor, file, uploader, pos);
      });
    },

    onPaste: (currentEditor, files, _htmlContent) => {
      const images = files.filter((file) => file.type.startsWith("image/"));
      images.forEach((file) => {
        uploadAndInsert(currentEditor, file, uploader);
      });
    },
  });
}

/**
 * 上传并插入图片到编辑器
 */
async function uploadAndInsert(
  editor: any,
  file: File,
  uploader: Uploader,
  pos?: number
) {
  try {
    console.log(`📤 开始上传图片: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

    const result = await uploader.upload(file);

    console.log(`✅ 图片上传成功: ${result.url}`);

    if (pos !== undefined) {
      // 拖拽场景：在指定位置插入
      editor.chain().focus().insertContentAt(pos, {
        type: "image",
        attrs: { src: result.url },
      }).run();
    } else {
      // 粘贴场景：在当前光标位置插入
      editor.chain().focus().setImage({ src: result.url }).run();
    }
  } catch (error) {
    console.error("❌ 图片上传失败:", error);
  }
}

// 保持向后兼容的导出（已弃用）
export { FileHandler as ImageUpload } from "@tiptap/extension-file-handler";
export type { Uploader as ImageUploadOptions } from "../types/uploader";

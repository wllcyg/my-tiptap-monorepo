import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { Uploader } from "../utils/uploader";

export interface ImageUploadOptions {
  uploader: Uploader;
}

/**
 * Tiptap 图片上传扩展
 * 拦截粘贴和拖拽行为中的图片文件，调用 uploader 上传。
 */
export const ImageUpload = Extension.create<ImageUploadOptions>({
  name: "imageUpload",

  addOptions() {
    return {
      uploader: undefined as unknown as Uploader,
    };
  },

  addProseMirrorPlugins() {
    const { uploader } = this.options;

    return [
      new Plugin({
        key: new PluginKey("imageUpload"),
        props: {
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items || []);
            const images = items.filter((item) => item.type.startsWith("image/"));

            if (images.length > 0) {
              event.preventDefault();
              images.forEach((item) => {
                const file = item.getAsFile();
                if (file) {
                  uploadAndInsertImage(view, file, uploader);
                }
              });
              return true;
            }
            return false;
          },
          handleDrop(view, event, _slice, moved) {
            if (moved || !event.dataTransfer?.files.length) {
              return false;
            }

            const files = Array.from(event.dataTransfer.files);
            const images = files.filter((file) => file.type.startsWith("image/"));

            if (images.length > 0) {
              event.preventDefault();
              images.forEach((file) => {
                uploadAndInsertImage(view, file, uploader);
              });
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

/**
 * 上传并插入图片的内部辅助函数
 */
async function uploadAndInsertImage(view: any, file: File, uploader: Uploader) {
  if (!uploader) return;

  try {
    // 1. 调用统一接口上传
    const result = await uploader.upload(file);

    // 2. 插入到编辑器
    const { schema } = view.state;
    const coordinates = view.posAtCoords({ left: 0, top: 0 }); // 这里可以根据鼠标位置优化
    const node = schema.nodes.image.create({ src: result.url });
    const transaction = view.state.tr.replaceSelectionWith(node);
    view.dispatch(transaction);
  } catch (error) {
    console.error("Image upload failed:", error);
    // 这里可以触发一个全局提示
  }
}

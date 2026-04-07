// 导出编辑器组件
import TiptapEditor from './components/TiptapEditor.vue'
export { TiptapEditor }
export default TiptapEditor

// 导出图片上传扩展（基于 @tiptap/extension-file-handler）
export { createImageUploadExtension } from './extensions/image-upload'
// 向后兼容
export { ImageUpload } from './extensions/image-upload'

// 导出上传器工厂和类型
export { UploaderFactory } from './utils/uploader'
export type { 
  Uploader, 
  UploaderOptions,
  UploadResult, 
  UploadProgress,
  OnProgress,
  COSConfig,
  OSSConfig
} from './types/uploader'
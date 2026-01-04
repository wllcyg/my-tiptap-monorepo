<!-- ToolBar.vue -->
<template>
    <div class="tiptap-toolbar px-8 py-3 border-b border-gray-300 dark:border-gray-700">
        <n-space align="center" :size="12">

            <n-button text size="large" :disabled="!canUndo" @click="editor?.chain().focus().undo().run()">
                撤销
            </n-button>

            <!-- 这里放你的工具按钮 -->
            <n-button text size="large">
                <strong>B</strong>
            </n-button>
            <n-button text size="large">
                <em>I</em>
            </n-button>
            <n-button text size="large">
                <u>U</u>
            </n-button>

            <!-- 示例：更多按钮 -->
            <n-button text size="large">H1</n-button>
            <n-button text size="large">H2</n-button>
            <n-button text size="large">• 列表</n-button>
            <n-button text size="large">“ 引用</n-button>
            <n-button text size="large">代码</n-button>

            <!-- 右侧可以放其他操作（如保存、全屏等） -->
            <n-button text size="large">保存</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton, NSpace, } from "naive-ui";
import { useToolbarState } from "../composables/useEditorMarks";
import { useTiptapEditor } from "../composables/useTiptapEditor";
const { canUndo, canRedo } = useToolbarState()
const editor = useTiptapEditor()
// const chain = ref(editor.value?.chain())


</script>

<style lang="scss" scoped>
.tiptap-toolbar {
    position: sticky;
    top: 0;
    z-index: 20;
}

/* 美化 text 类型的按钮：去掉默认背景和边框，保持纯文字感 */
:deep(.n-button--text-type) {
    color: rgb(100 116 139);
    /* slate-500 */

    &:hover {
        color: rgb(51 65 85);
        /* slate-700 */
    }

    &.n-button--primary-type {
        color: rgb(59 130 246);
        /* blue-500 */
    }
}

.dark :deep(.n-button--text-type) {
    color: rgb(148 163 184);
    /* slate-400 */

    &:hover {
        color: rgb(203 213 225);
        /* slate-300 */
    }

    &.n-button--primary-type {
        color: rgb(96 165 250);
        /* blue-400 */
    }
}
</style>
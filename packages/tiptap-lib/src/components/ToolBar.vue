<template>
    <div class="tiptap-toolbar px-8 py-3 border-b border-gray-300 dark:border-gray-700">
        <n-space align="center" :size="12">
            <template v-for="item in tools" :key="item">
                <!-- Undo/Redo Group -->
                <n-button v-if="item === 'undo'" text size="large" :disabled="!undoState.canExecute.value"
                    @click="undoState.handleAction">
                    撤销
                </n-button>
                <n-button v-if="item === 'redo'" text size="large" :disabled="!redoState.canExecute.value"
                    @click="redoState.handleAction">
                    重做
                </n-button>

                <!-- Formatting -->
                <n-button v-if="item === 'bold'" text size="large" :class="{ 'is-active': editor?.isActive('bold') }"
                    @click="editor?.chain().focus().toggleBold().run()">
                    <strong>B</strong>
                </n-button>

                <n-button v-if="item === 'italic'" text size="large"
                    :class="{ 'is-active': editor?.isActive('italic') }"
                    @click="editor?.chain().focus().toggleItalic().run()">
                    <em>I</em>
                </n-button>

                <!-- Headings -->
                <n-button v-if="item === 'h1'" text size="large"
                    :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
                    H1
                </n-button>

                <n-button v-if="item === 'h2'" text size="large"
                    :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
                    H2
                </n-button>

                <n-button v-if="item === 'bulletList'" text size="large"
                    :class="{ 'is-active': editor?.isActive('bulletList') }"
                    @click="editor?.chain().focus().toggleBulletList().run()">
                    • 列表
                </n-button>

                <n-button v-if="item === 'blockquote'" text size="large"
                    :class="{ 'is-active': editor?.isActive('blockquote') }"
                    @click="editor?.chain().focus().toggleBlockquote().run()">
                    “ 引用
                </n-button>

                <n-button v-if="item === 'codeBlock'" text size="large"
                    :class="{ 'is-active': editor?.isActive('codeBlock') }"
                    @click="editor?.chain().focus().toggleCodeBlock().run()">
                    代码
                </n-button>

            </template>

            <!-- 右侧可以放其他操作（如保存、全屏等） -->
            <n-button text size="large">保存</n-button>
        </n-space>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NSpace, } from "naive-ui";
import { useTiptapEditor } from "../composables/useTiptapEditor";
import { useUndoRedo } from "../composables/useUndoRedo";
import { ToolbarItemType, DEFAULT_TOOLS } from "../types/toolbar";

const props = defineProps<{
    tools?: ToolbarItemType[]
}>()

const editor = useTiptapEditor()

// 如果没有传入 tools，使用默认工具集
const tools = computed(() => props.tools ?? DEFAULT_TOOLS)

// 为 Undo/Redo 单独初始化状态
const undoState = useUndoRedo({ action: 'undo', hideWhenUnavailable: false })
const redoState = useUndoRedo({ action: 'redo', hideWhenUnavailable: false })
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

    &.is-active {
        color: rgb(15 23 42);
        /* slate-900 */
        background-color: rgb(241 245 249);
        /* slate-100 */
        font-weight: 600;
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
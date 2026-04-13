import { describe, it, expect, beforeEach } from 'vitest'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useColorHighlight } from './useColorHighlight'
import { provideTiptapEditor } from '../../composables/useTiptapEditor'

// 创建一个测试容器组件，用于提供注入环境
const TestComponent = defineComponent({
  props: ['editor'],
  setup(props) {
    // 模拟 TiptapEditor.vue 的 provide 行为
    provideTiptapEditor(ref(props.editor))
    const highlight = useColorHighlight()
    return { highlight }
  },
  render() { return h('div') }
})

describe('useColorHighlight', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor({
      extensions: [
        StarterKit, 
        Highlight.configure({ multicolor: true })
      ],
      content: '<p>Hello World</p>',
    })
  })

  it('应该在初始状态下未激活且无颜色', () => {
    const wrapper = mount(TestComponent, { 
      props: { editor } 
    })
    
    expect(wrapper.vm.highlight.isActive).toBe(false)
    expect(wrapper.vm.highlight.currentColor).toBe(null)
  })

  it('当选中文字并应用颜色时，状态应变为 isActive', async () => {
    const wrapper = mount(TestComponent, { 
      props: { editor } 
    })
    
    // 模拟选中文字
    editor.commands.selectAll()
    
    // 调用设置高亮的方法
    wrapper.vm.highlight.setHighlight('#ff0000')

    expect(wrapper.vm.highlight.isActive).toBe(true)
    expect(wrapper.vm.highlight.currentColor).toBe('#ff0000')
  })

  it('应用 removeHighlight 后，状态应重置', async () => {
    const wrapper = mount(TestComponent, { 
      props: { editor } 
    })
    
    editor.commands.selectAll()
    wrapper.vm.highlight.setHighlight('#ff0000')
    expect(wrapper.vm.highlight.isActive).toBe(true)

    // 移除高亮
    wrapper.vm.highlight.removeHighlight()
    
    expect(wrapper.vm.highlight.isActive).toBe(false)
    expect(wrapper.vm.highlight.currentColor).toBe(null)
  })
})

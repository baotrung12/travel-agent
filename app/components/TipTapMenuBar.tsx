import {Editor, useEditorState} from "@tiptap/react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null // or a loading spinner
  }
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="tiptap-control-group">
      <div className="button-group">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={(editorState.isBold ? 'is-active ' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={(editorState.isItalic ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={(editorState.isHeading1 ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={(editorState.isHeading2 ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={(editorState.isBulletList ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={(editorState.isOrderedList ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          Ordered list
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={(editorState.isBlockquote ? 'is-active' : '') + 'bg-gray-200 text-back px-2 py-1 font-semibold rounded-md hover:bg-gray-300 mr-2'}
        >
          Blockquote
        </button>
      </div>
    </div>
  )
}
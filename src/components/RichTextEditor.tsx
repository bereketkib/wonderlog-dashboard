import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  tooltip: string;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
}

const MenuButton = ({
  onClick,
  active,
  disabled,
  children,
  tooltip,
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
    disabled={disabled}
    title={tooltip}
    className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
      active
        ? "text-purple-600 dark:text-purple-400"
        : "text-gray-600 dark:text-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
  error,
}: RichTextEditorProps) {
  const previousContentRef = useRef(content);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const debouncedOnChange = useCallback(
    (newContent: string) => {
      if (newContent === previousContentRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        previousContentRef.current = newContent;
        onChange(newContent);
      }, 1000);
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      debouncedOnChange(newContent);
    },
  });

  if (!editor) return null;

  return (
    <div
      className={`border rounded-lg dark:border-gray-700 flex flex-col ${
        error ? "border-red-500 dark:border-red-500" : ""
      }`}
    >
      <div className="border-b dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          tooltip="Large Heading"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          tooltip="Medium Heading"
        >
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          tooltip="Small Heading"
        >
          <Heading3 size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          tooltip="Numbered List"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          tooltip="Quote Block"
        >
          <Quote size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          tooltip="Code Block"
        >
          <Code size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          tooltip="Horizontal Line"
        >
          <Minus size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Y)"
        >
          <Redo size={18} />
        </MenuButton>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        <EditorContent editor={editor} className="p-4" />
      </div>
    </div>
  );
}

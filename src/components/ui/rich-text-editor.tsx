"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Type,
  Palette,
} from "lucide-react";
import {
  EditorProvider,
  EditorBubbleMenu,
} from "@/components/ui/kibo-ui/editor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (content: string) => void;
  className?: string;
  disabled?: boolean;
  limit?: number;
}

const EditorToolbar = () => {
  const { editor } = useCurrentEditor();
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    code: false,
  });

  if (!editor) return null;

  return (
    <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
      <Button
        type="button"
        variant={
          editor.isActive("bold") || activeStates.bold ? "default" : "ghost"
        }
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          setActiveStates((prev) => ({ ...prev, bold: !prev.bold }));
          editor.chain().focus().toggleBold().run();
          // Reset state after a short delay to sync with editor
          setTimeout(() => {
            setActiveStates((prev) => ({
              ...prev,
              bold: editor.isActive("bold"),
            }));
          }, 50);
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("bold") || activeStates.bold
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3 w-3" />
      </Button>

      <Button
        type="button"
        variant={
          editor.isActive("italic") || activeStates.italic ? "default" : "ghost"
        }
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          setActiveStates((prev) => ({ ...prev, italic: !prev.italic }));
          editor.chain().focus().toggleItalic().run();
          setTimeout(() => {
            setActiveStates((prev) => ({
              ...prev,
              italic: editor.isActive("italic"),
            }));
          }, 50);
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("italic") || activeStates.italic
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3 w-3" />
      </Button>

      <Button
        type="button"
        variant={
          editor.isActive("code") || activeStates.code ? "default" : "ghost"
        }
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          setActiveStates((prev) => ({ ...prev, code: !prev.code }));
          editor.chain().focus().toggleCode().run();
          setTimeout(() => {
            setActiveStates((prev) => ({
              ...prev,
              code: editor.isActive("code"),
            }));
          }, 50);
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("code") || activeStates.code
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Inline Code"
      >
        <Code className="h-3 w-3" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("bulletList")
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Bullet List"
      >
        <List className="h-3 w-3" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("orderedList")
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Numbered List"
      >
        <ListOrdered className="h-3 w-3" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`h-8 w-8 p-0 ${
          editor.isActive("blockquote")
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Quote"
      >
        <Quote className="h-3 w-3" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("heading", { level: 1 })) {
            // Se H1 já está ativo, remove o heading (volta para parágrafo normal)
            editor.chain().focus().setParagraph().run();
          } else {
            // Se H1 não está ativo, aplica H1 (isso automaticamente remove outros headings)
            editor.chain().focus().setHeading({ level: 1 }).run();
          }
        }}
        className={`h-8 px-2 ${
          editor.isActive("heading", { level: 1 })
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Heading 1"
      >
        <span className="text-xs font-bold">H1</span>
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("heading", { level: 2 })) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().setHeading({ level: 2 }).run();
          }
        }}
        className={`h-8 px-2 ${
          editor.isActive("heading", { level: 2 })
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Heading 2"
      >
        <span className="text-xs font-bold">H2</span>
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("heading", { level: 3 })) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().setHeading({ level: 3 }).run();
          }
        }}
        className={`h-8 px-2 ${
          editor.isActive("heading", { level: 3 })
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Heading 3"
      >
        <span className="text-xs font-bold">H3</span>
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 4 }) ? "default" : "ghost"}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          if (editor.isActive("heading", { level: 4 })) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().setHeading({ level: 4 }).run();
          }
        }}
        className={`h-8 px-2 ${
          editor.isActive("heading", { level: 4 })
            ? "bg-primary text-primary-foreground"
            : ""
        }`}
        title="Heading 4"
      >
        <span className="text-xs font-bold">H4</span>
      </Button>

      <div className="ml-auto text-xs text-muted-foreground px-2 py-1">
        💡 Type <kbd className="bg-muted px-1 rounded text-xs">/</kbd> for more
        commands
      </div>
    </div>
  );
};

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    { placeholder, value, onChange, className, disabled, limit = 1000 },
    ref
  ) => {
    useImperativeHandle(ref, () => document.createElement("div"));

    return (
      <div
        className={cn(
          "border rounded-md overflow-hidden bg-background",
          className
        )}
      >
        <EditorProvider
          placeholder={placeholder}
          content={value}
          onUpdate={({ editor }) => {
            const text = editor.getText();
            onChange?.(text);
          }}
          onCreate={({ editor }) => {
            // When editor is created, make sure it reflects the current value
            if (value === "" || value === undefined) {
              editor.commands.clearContent();
            }
          }}
          onTransaction={({ editor }) => {
            // Clear editor content when value prop is empty
            if ((value === "" || value === undefined) && editor.getText().trim() !== "") {
              editor.commands.clearContent();
            }
          }}
          limit={limit}
          editable={!disabled}
          editorProps={{
            handleKeyDown: (view, event) => {
              // Prevent form submission on Enter or Shift+Enter
              if (event.key === "Enter") {
                // Allow normal Enter for line breaks, prevent form submission
                event.stopPropagation();
                return false;
              }
              return false;
            },
          }}
          className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-3 [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:border-none"
        >
          <EditorToolbar />
        </EditorProvider>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

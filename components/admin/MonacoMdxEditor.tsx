"use client";

import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface MonacoMdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (line: number, col: number) => void;
}

export default function MonacoMdxEditor({
  value,
  onChange,
  onCursorChange,
}: MonacoMdxEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Custom Cyber-Terminal Theme
    monaco.editor.defineTheme("cyber-terminal", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "00f5d4", fontStyle: "bold" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "bd00ff" },
        { token: "tag", foreground: "00f5d4" },
        { token: "attribute.name", foreground: "f59e0b" },
        { token: "delimiter", foreground: "8b949e" },
      ],
      colors: {
        "editor.background": "#07090e",
        "editor.foreground": "#e6edf3",
        "editorCursor.foreground": "#00f5d4",
        "editor.lineHighlightBackground": "#0f1623",
        "editorLineNumber.foreground": "#484f58",
        "editorLineNumber.activeForeground": "#00f5d4",
        "editor.selectionBackground": "#1e3a5f80",
        "editorBracketMatch.border": "#00f5d4",
        "editorIndentGuide.background": "#161b22",
        "editorIndentGuide.activeBackground": "#30363d",
      },
    });

    monaco.editor.setTheme("cyber-terminal");

    // Listen to cursor movement
    editor.onDidChangeCursorPosition((e: any) => {
      if (onCursorChange) {
        onCursorChange(e.position.lineNumber, e.position.column);
      }
    });
  };

  return (
    <div className="w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-cyber-border shadow-2xl bg-cyber-950">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        theme="vs-dark"
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 13,
          lineHeight: 20,
          tabSize: 2,
          wordWrap: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          renderLineHighlight: "all",
          bracketPairColorization: { enabled: true },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 16, bottom: 16 },
        }}
        loading={
          <div className="w-full h-full flex items-center justify-center bg-cyber-950 font-mono text-xs text-cyber-cyan animate-pulse">
            LOADING MONACO MDX STUDIO...
          </div>
        }
      />
    </div>
  );
}

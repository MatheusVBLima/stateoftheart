"use client";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";

type CodeBlockProps = {
  language: string;
  filename: string;
  highlightLines?: number[];
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

export const CodeBlock = ({
  language,
  filename,
  code,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div className="relative w-full rounded-lg bg-slate-900 font-mono text-sm">
      {tabsExist && (
        <div className="flex overflow-x-auto px-4 pt-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-3 !py-2 text-xs transition-colors font-sans ${
                activeTab === index
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}
      {!tabsExist && filename && filename.trim() !== "" && (
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <div className="text-xs text-zinc-400">{filename}</div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          </button>
        </div>
      )}
      {!tabsExist && (!filename || filename.trim() === "") && (
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 z-10 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
        >
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </button>
      )}
      <SyntaxHighlighter
        language={activeLanguage}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: "0.75rem",
          background: "transparent",
          fontSize: "0.75rem",
          overflow: "auto",
          minWidth: "100%",
        }}
        wrapLines={true}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: "2rem",
          paddingRight: "0.75rem",
          paddingLeft: "0.25rem",
          color: "#6b7280",
          backgroundColor: "transparent",
          userSelect: "none",
          textAlign: "right",
        }}
        codeTagProps={{
          style: {
            background: "transparent",
            fontFamily: "inherit",
          },
        }}
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: activeHighlightLines.includes(lineNumber)
              ? "rgba(255,255,255,0.1)"
              : "transparent",
            display: "block",
            width: "100%",
          },
        })}
        PreTag="div"
      >
        {String(activeCode)}
      </SyntaxHighlighter>
    </div>
  );
};

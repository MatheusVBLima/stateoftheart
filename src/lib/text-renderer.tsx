import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

interface CodeBlockMatch {
  type: "code";
  content: string;
  language: string;
  start: number;
  end: number;
}

interface TextMatch {
  type: "text";
  content: string;
  start: number;
  end: number;
}

type ContentMatch = CodeBlockMatch | TextMatch;

// Regex para detectar blocos de código com ```language
const CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g;

// Regex para detectar código inline com `code`
const INLINE_CODE_REGEX = /`([^`]+)`/g;

function parseContentWithCode(text: string): ContentMatch[] {
  const matches: ContentMatch[] = [];
  let lastIndex = 0;

  // Find all code blocks
  let match;
  const codeBlockRegex = new RegExp(CODE_BLOCK_REGEX.source, "g");

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      matches.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
        start: lastIndex,
        end: match.index,
      });
    }

    // Add code block
    matches.push({
      type: "code",
      content: match[2] || match[0], // Use captured code or entire match
      language: match[1] || "text", // Use captured language or default to text
      start: match.index,
      end: match.index + match[0].length,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    matches.push({
      type: "text",
      content: text.slice(lastIndex),
      start: lastIndex,
      end: text.length,
    });
  }

  // If no code blocks found, return the entire text as text
  if (matches.length === 0) {
    matches.push({
      type: "text",
      content: text,
      start: 0,
      end: text.length,
    });
  }

  return matches;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Combined regex for inline code, bold, and other markdown elements
  const markdownRegex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add text before markdown
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Inline code
      const code = match[1].slice(1, -1); // Remove backticks
      parts.push(
        <code
          key={`inline-${key++}`}
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {code}
        </code>,
      );
    } else if (match[2]) {
      // Bold text
      const boldText = match[2].slice(2, -2); // Remove **
      parts.push(
        <strong key={`bold-${key++}`} className="font-semibold">
          {boldText}
        </strong>,
      );
    } else if (match[3]) {
      // Italic text
      const italicText = match[3].slice(1, -1); // Remove *
      parts.push(
        <em key={`italic-${key++}`} className="italic">
          {italicText}
        </em>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function renderTextWithCode(text: string): React.ReactNode {
  if (!text) return null;

  const contentMatches = parseContentWithCode(text);

  return (
    <div className="space-y-4">
      {contentMatches.map((match, index) => {
        if (match.type === "code") {
          return (
            <CodeBlock
              key={`code-${index}`}
              language={match.language}
              filename=""
              code={match.content.trim()}
            />
          );
        } else {
          // Process text for markdown
          const lines = match.content.split("\n");
          return (
            <div key={`text-${index}`} className="space-y-2">
              {lines.map((line, lineIndex) => {
                const trimmedLine = line.trim();

                // Handle headers
                if (trimmedLine.startsWith("# ")) {
                  return (
                    <h1 key={`line-${lineIndex}`} className="text-2xl font-bold mt-6 mb-4">
                      {renderInlineMarkdown(trimmedLine.slice(2))}
                    </h1>
                  );
                } else if (trimmedLine.startsWith("## ")) {
                  return (
                    <h2 key={`line-${lineIndex}`} className="text-xl font-semibold mt-5 mb-3">
                      {renderInlineMarkdown(trimmedLine.slice(3))}
                    </h2>
                  );
                } else if (trimmedLine.startsWith("### ")) {
                  return (
                    <h3 key={`line-${lineIndex}`} className="text-lg font-semibold mt-4 mb-2">
                      {renderInlineMarkdown(trimmedLine.slice(4))}
                    </h3>
                  );
                } else if (trimmedLine.startsWith("- ")) {
                  return (
                    <ul key={`line-${lineIndex}`} className="list-disc list-inside mb-2">
                      <li>{renderInlineMarkdown(trimmedLine.slice(2))}</li>
                    </ul>
                  );
                } else if (trimmedLine === "") {
                  return <div key={`line-${lineIndex}`} className="h-2" />;
                } else {
                  return (
                    <p key={`line-${lineIndex}`} className="mb-2 leading-relaxed">
                      {renderInlineMarkdown(line)}
                    </p>
                  );
                }
              })}
            </div>
          );
        }
      })}
    </div>
  );
}

// Helper function to check if text contains code
export function hasCode(text: string): boolean {
  return CODE_BLOCK_REGEX.test(text) || INLINE_CODE_REGEX.test(text);
}

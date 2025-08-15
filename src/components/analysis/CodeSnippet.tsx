'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
  code: string;
  language: string;
  fileName?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export default function CodeSnippet({
  code,
  language,
  fileName,
  highlightLines = [],
  showLineNumbers = true
}: CodeSnippetProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="rounded-md overflow-hidden bg-gray-800 shadow-md">
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-700 text-gray-200">
          <span className="text-sm font-mono">{fileName}</span>
          <button
            onClick={copyToClipboard}
            className="text-xs px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
            aria-label="Copy code to clipboard"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => {
            const style: React.CSSProperties = { display: 'block' };
            if (highlightLines.includes(lineNumber)) {
              style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
              style.borderLeft = '3px solid yellow';
            }
            return { style };
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            borderRadius: fileName ? '0' : '0.375rem'
          }}
        >
          {code}
        </SyntaxHighlighter>
        
        {!fileName && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
            aria-label="Copy code to clipboard"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

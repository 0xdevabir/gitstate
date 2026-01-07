'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { EmbedCode } from '@/types/github';

interface EmbedCodeDisplayProps {
  embedCode: EmbedCode | null;
}

export default function EmbedCodeDisplay({ embedCode }: EmbedCodeDisplayProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!embedCode) {
    return null;
  }

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const codeOptions = [
    { type: 'markdown', label: 'Markdown', code: embedCode.markdown },
    { type: 'html', label: 'HTML', code: embedCode.html },
    { type: 'svg', label: 'SVG', code: embedCode.svg },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Embed Code</h3>
      <div className="grid gap-4">
        {codeOptions.map((option) => (
          <div key={option.type} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">{option.label}</label>
              <button
                onClick={() => handleCopy(option.code, option.type)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                {copiedType === option.type ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-800 text-gray-300 p-3 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
              <code>{option.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

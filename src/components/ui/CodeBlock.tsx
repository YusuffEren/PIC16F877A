'use client';
import React from 'react';

interface CodeBlockProps {
  code: string;
  highlightLines?: number[];
  className?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, highlightLines = [], className = '', title }) => {
  const lines = code.split('\n');

  const getTokenColor = (line: string): React.ReactNode => {
    // Very lightweight syntax coloring
    const trimmed = line;
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }
    if (trimmed.startsWith('#')) {
      return <span className="text-purple-400">{line}</span>;
    }

    // Simple keyword coloring for demonstration
    const keywords = ['void', 'unsigned', 'char', 'int', 'if', 'else', 'while', 'for', 'return', 'volatile', 'define'];
    const funcs = ['Lcd_Komut', 'Lcd_Yaz', 'Lcd_Hazirla', 'Lcd_Git', 'sprintf', '__delay_ms', '__delay_us', 'main'];
    const macros = ['RS', 'EN', 'D4', 'D5', 'D6', 'D7', 'B_SAAT_ARTIR', 'B_SAAT_AZALT', 'B_DAK_ARTIR', 'B_DAK_AZALT', 'TMR1IF', 'PORTD'];

    let colored = line;

    // We keep it simple and fast: just color keywords, functions, macros, strings, numbers
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const patterns = [
      { regex: /"([^"]*)"/g, color: 'text-emerald-400' },
      { regex: /'([^']*)'/g, color: 'text-emerald-400' },
      { regex: /\b(0x[0-9A-Fa-f]+)\b/g, color: 'text-amber-400' },
      { regex: /\b(\d+)\b/g, color: 'text-amber-400' },
      { regex: new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), color: 'text-pink-400' },
      { regex: new RegExp(`\\b(${funcs.join('|')})\\b`, 'g'), color: 'text-cyan-300' },
      { regex: new RegExp(`\\b(${macros.join('|')})\\b`, 'g'), color: 'text-orange-300' },
    ];

    // A simple split approach by scanning
    while (remaining.length > 0) {
      let bestMatch: { index: number; length: number; color: string } | null = null;

      for (const p of patterns) {
        const m = p.regex.exec(remaining);
        if (m && m.index === 0) {
          bestMatch = { index: 0, length: m[0].length, color: p.color };
          break;
        }
      }

      if (bestMatch) {
        parts.push(
          <span key={key++} className={bestMatch.color}>
            {remaining.slice(0, bestMatch.length)}
          </span>
        );
        remaining = remaining.slice(bestMatch.length);
      } else {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      }
    }

    return <>{parts}</>;
  };

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/80 shadow-xl ${className}`}>
      {title && (
        <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 text-xs text-slate-400 font-mono flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 text-slate-300">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-relaxed">
          {lines.map((line, i) => {
            const isHighlighted = highlightLines.includes(i + 1);
            return (
              <div
                key={i}
                className={`flex ${isHighlighted ? 'bg-cyan-500/8 -mx-4 px-4 border-l-[3px] border-cyan-400' : ''}`}
              >
                <span className="select-none text-slate-600 w-9 text-right mr-4 shrink-0 text-[11px] pt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300 whitespace-pre">{getTokenColor(line)}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

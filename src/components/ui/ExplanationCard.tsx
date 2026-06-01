import React from 'react';

interface ExplanationCardProps {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  className?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ title, paragraphs, bullets, className = '' }) => {
  return (
    <div className={`mt-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 md:p-6 ${className}`}>
      <h4 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </h4>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

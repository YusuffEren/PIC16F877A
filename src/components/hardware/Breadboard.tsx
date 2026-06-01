'use client';
import React from 'react';

interface BreadboardProps {
  className?: string;
}

export const Breadboard: React.FC<BreadboardProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 800 400"
      className={`hw-breadboard w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="holes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.8" fill="#0f172a" opacity="0.85" />
        </pattern>
        <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="boardShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main body */}
      <rect x="20" y="20" width="760" height="360" rx="10" fill="url(#boardGrad)" stroke="#94a3b8" strokeWidth="1.5" filter="url(#boardShadow)" />

      {/* Central groove */}
      <rect x="20" y="198" width="760" height="4" fill="#94a3b8" opacity="0.6" />

      {/* Top positive rail (red) */}
      <rect x="35" y="28" width="730" height="14" rx="3" fill="#fecaca" opacity="0.35" stroke="#ef4444" strokeWidth="0.5" />
      <text x="48" y="39" fontSize="9" fill="#dc2626" fontFamily="monospace" fontWeight="bold">+</text>

      {/* Top negative rail (blue) */}
      <rect x="35" y="358" width="730" height="14" rx="3" fill="#bfdbfe" opacity="0.35" stroke="#3b82f6" strokeWidth="0.5" />
      <text x="48" y="369" fontSize="9" fill="#2563eb" fontFamily="monospace" fontWeight="bold">-</text>

      {/* Holes zones */}
      <rect x="35" y="48" width="730" height="145" fill="url(#holes)" opacity="0.5" />
      <rect x="35" y="208" width="730" height="145" fill="url(#holes)" opacity="0.5" />

      {/* Subtle column numbers */}
      {Array.from({ length: 10 }).map((_, i) => (
        <text key={`t${i}`} x={80 + i * 70} y="44" fontSize="7" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">{i * 5 + 1}</text>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <text key={`b${i}`} x={80 + i * 70} y="395" fontSize="7" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">{i * 5 + 1}</text>
      ))}
    </svg>
  );
};

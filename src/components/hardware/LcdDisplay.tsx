'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';

interface LcdDisplayProps {
  className?: string;
}

export const LcdDisplay: React.FC<LcdDisplayProps> = ({ className = '' }) => {
  const saat = useClockStore((s) => s.saat);
  const dakika = useClockStore((s) => s.dakika);
  const saniye = useClockStore((s) => s.saniye);

  const timeStr = `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}:${String(saniye).padStart(2, '0')}`;

  return (
    <svg
      viewBox="0 0 480 180"
      className={`hw-lcd w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="lcdBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1120" />
          <stop offset="100%" stopColor="#151e32" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer bezel / PCB */}
      <rect x="10" y="10" width="460" height="160" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <rect x="14" y="14" width="452" height="152" rx="8" fill="url(#lcdBodyGrad)" />

      {/* Screen area */}
      <rect x="36" y="32" width="408" height="116" rx="4" fill="url(#screenGrad)" stroke="#1e293b" strokeWidth="1" />

      {/* Backlight glow zone */}
      <rect className="hw-lcd-backlight" x="38" y="34" width="404" height="112" rx="3" fill="#06b6d4" opacity="0.06" filter="url(#neonGlow)" />

      {/* Subtle LCD grid */}
      <g opacity="0.25">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`c${i}`} x1={60 + i * 22} y1="34" x2={60 + i * 22} y2="146" stroke="#1e293b" strokeWidth="0.5" />
        ))}
        <line x1="38" y1="90" x2="442" y2="90" stroke="#1e293b" strokeWidth="0.5" />
      </g>

      {/* Row 1: Title */}
      <text
        x="240"
        y="68"
        textAnchor="middle"
        fontSize="18"
        fill="#22d3ee"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="3"
        filter="url(#textGlow)"
        opacity="0.85"
      >
        DIJITAL SAAT
      </text>

      {/* Row 2: Time with per-digit animation */}
      <AnimatePresence mode="wait">
        <motion.text
          key={timeStr}
          x="240"
          y="122"
          textAnchor="middle"
          fontSize="32"
          fill="#67e8f9"
          fontFamily="'Courier New', Courier, monospace"
          fontWeight="bold"
          letterSpacing="4"
          filter="url(#textGlow)"
          initial={{ opacity: 0.4, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.12 }}
        >
          {timeStr}
        </motion.text>
      </AnimatePresence>

      {/* Pin labels */}
      <g fontSize="7" fill="#64748b" fontFamily="monospace" textAnchor="middle">
        <text x="55" y="166">VSS</text>
        <text x="95" y="166">VDD</text>
        <text x="135" y="166">VO</text>
        <text x="175" y="166">RS</text>
        <text x="215" y="166">RW</text>
        <text x="255" y="166">EN</text>
        <text x="305" y="166">D4</text>
        <text x="335" y="166">D5</text>
        <text x="365" y="166">D6</text>
        <text x="395" y="166">D7</text>
      </g>
    </svg>
  );
};

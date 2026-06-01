'use client';
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClockStore } from '@/store/useClockStore';

interface HwButtonProps {
  label: string;
  btnId: 1 | 2 | 3 | 4;
  className?: string;
  showIcon?: boolean;
}

const iconMap: Record<number, string> = {
  1: '▲',
  2: '▼',
  3: '▲',
  4: '▼',
};

const colorMap: Record<number, { capTop: string; capBot: string; stroke: string; glow: string }> = {
  1: { capTop: '#34d399', capBot: '#059669', stroke: '#047857', glow: 'rgba(52,211,153,0.8)' },
  2: { capTop: '#f87171', capBot: '#dc2626', stroke: '#b91c1c', glow: 'rgba(248,113,113,0.8)' },
  3: { capTop: '#fbbf24', capBot: '#d97706', stroke: '#b45309', glow: 'rgba(251,191,36,0.8)' },
  4: { capTop: '#a78bfa', capBot: '#7c3aed', stroke: '#6d28d9', glow: 'rgba(167,139,250,0.8)' },
};

export const HwButton: React.FC<HwButtonProps> = ({ label, btnId, className = '', showIcon = true }) => {
  const [spark, setSpark] = useState(false);
  const colors = colorMap[btnId];

  const actionMap = {
    1: useClockStore((s) => s.incrementHour),
    2: useClockStore((s) => s.decrementHour),
    3: useClockStore((s) => s.incrementMinute),
    4: useClockStore((s) => s.decrementMinute),
  };

  const setButtonState = useClockStore((s) => s.setButtonState);

  const handlePointerDown = useCallback(() => {
    actionMap[btnId]();
    setSpark(true);
  }, [btnId]);

  const handlePointerUp = useCallback(() => {
    setButtonState(btnId, 0);
    setTimeout(() => setSpark(false), 400);
  }, [btnId]);

  const handlePointerLeave = useCallback(() => {
    setButtonState(btnId, 0);
    setTimeout(() => setSpark(false), 400);
  }, [btnId]);

  return (
    <div className={`hw-buttons relative flex flex-col items-center ${className}`}>
      <motion.button
        className="relative w-full aspect-[4/3] outline-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id={`btnBodyGrad${btnId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id={`btnCapGrad${btnId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.capTop} />
              <stop offset="100%" stopColor={colors.capBot} />
            </linearGradient>
            <filter id={`btnShadow${btnId}`}>
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
            <filter id={`btnGlow${btnId}`}>
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base housing */}
          <rect x="12" y="32" width="96" height="46" rx="8" fill={`url(#btnBodyGrad${btnId})`} stroke="#334155" strokeWidth="1.5" filter={`url(#btnShadow${btnId})`} />

          {/* Side pins */}
          <rect x="20" y="76" width="8" height="10" rx="2" fill="#94a3b8" />
          <rect x="92" y="76" width="8" height="10" rx="2" fill="#94a3b8" />

          {/* Button cap - 3D cylinder */}
          <rect x="18" y="18" width="84" height="28" rx="7" fill={`url(#btnCapGrad${btnId})`} stroke={colors.stroke} strokeWidth="1.5" />
          <ellipse cx="60" cy="18" rx="42" ry="7" fill={colors.capTop} opacity="0.5" filter={`url(#btnGlow${btnId})`} />

          {/* Icon on cap */}
          {showIcon && (
            <text x="60" y="38" textAnchor="middle" fontSize="20" fill="white" fontFamily="monospace" fontWeight="bold" opacity="0.95" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
              {iconMap[btnId]}
            </text>
          )}

          {/* Inner detail line */}
          <rect x="22" y="22" width="76" height="20" rx="4" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        </svg>

        {/* Electric signal spark traveling from button to PIC */}
        <AnimatePresence>
          {spark && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-amber-300 pointer-events-none"
              style={{ boxShadow: `0 0 12px 4px ${colors.glow}` }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: [0, 30, 60, 90, 120],
                y: [0, -20, -40, -60, -80],
                opacity: [1, 1, 1, 0.6, 0],
                scale: [1, 0.8, 0.6, 0.4, 0.2],
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
      <span className="mt-2 text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
        {label}
      </span>
    </div>
  );
};

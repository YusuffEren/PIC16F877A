'use client';
import React from 'react';

interface Pic16f877aProps {
  className?: string;
}

export const Pic16f877a: React.FC<Pic16f877aProps> = ({ className = '' }) => {
  const pins = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <svg
      viewBox="0 0 240 580"
      className={`hw-pic w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="picBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
      </defs>

      {/* Package body */}
      <rect x="40" y="20" width="160" height="540" rx="8" fill="url(#picBody)" stroke="#374151" strokeWidth="2" />

      {/* Notch indicator */}
      <circle cx="120" cy="36" r="6" fill="#374151" />
      <text x="120" y="40" textAnchor="middle" fontSize="6" fill="#9ca3af" fontFamily="monospace">●</text>

      {/* Label */}
      <text x="120" y="120" textAnchor="middle" fontSize="14" fill="#22d3ee" fontWeight="bold" fontFamily="monospace" style={{ letterSpacing: '1px' }}>
        PIC16F877A
      </text>
      <text x="120" y="140" textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="monospace">
        MICROCHIP
      </text>

      {/* Left pins */}
      {pins.map((pin, i) => {
        const y = 60 + i * 24;
        const label = getPinLabel(pin);
        return (
          <g key={`L${pin}`}>
            <rect x="20" y={y - 4} width="20" height="8" fill="#d1d5db" stroke="#6b7280" strokeWidth="0.5" />
            <text x="14" y={y + 2} textAnchor="end" fontSize="8" fill="#9ca3af" fontFamily="monospace">{pin}</text>
            {label && (
              <text x="52" y={y + 2} textAnchor="start" fontSize="7" fill="#e5e7eb" fontFamily="monospace">{label}</text>
            )}
          </g>
        );
      })}

      {/* Right pins (mirrored numbering) */}
      {pins.map((pin, i) => {
        const actualPin = 40 - pin + 1;
        const y = 60 + i * 24;
        const label = getPinLabel(actualPin);
        return (
          <g key={`R${actualPin}`}>
            <rect x="200" y={y - 4} width="20" height="8" fill="#d1d5db" stroke="#6b7280" strokeWidth="0.5" />
            <text x="226" y={y + 2} textAnchor="start" fontSize="8" fill="#9ca3af" fontFamily="monospace">{actualPin}</text>
            {label && (
              <text x="188" y={y + 2} textAnchor="end" fontSize="7" fill="#e5e7eb" fontFamily="monospace">{label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

function getPinLabel(pin: number): string {
  const labels: Record<number, string> = {
    1: 'MCLR',
    11: 'VDD',
    12: 'VSS',
    13: 'OSC1',
    14: 'OSC2',
    15: 'RA7',
    16: 'RA6',
    17: 'RA5',
    18: 'RA4',
    19: 'RA3',
    20: 'RA2',
    21: 'RA1',
    22: 'RA0',
    23: 'VSS',
    24: 'VDD',
    33: 'RD7',
    34: 'RD6',
    35: 'RD5',
    36: 'RD4',
    37: 'RC7',
    38: 'RC6',
    39: 'RC5',
    40: 'RC4',
  };
  // Port B pins (right side top)
  if (pin >= 33 && pin <= 40) return labels[pin];
  if (pin <= 22) return labels[pin] || '';
  return '';
}

'use client';
import React from 'react';

interface CrystalProps {
  className?: string;
}

export const Crystal: React.FC<CrystalProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 220 120"
      className={`hw-crystal w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
      </defs>

      {/* Crystal body */}
      <rect x="80" y="35" width="60" height="50" rx="4" fill="url(#metal)" stroke="#6b7280" strokeWidth="1" />
      <text x="110" y="62" textAnchor="middle" fontSize="10" fill="#1f2937" fontFamily="monospace" fontWeight="bold">
        20.000
      </text>
      <text x="110" y="76" textAnchor="middle" fontSize="8" fill="#374151" fontFamily="monospace">
        MHz
      </text>

      {/* Left lead */}
      <line x1="50" y1="60" x2="80" y2="60" stroke="#d1d5db" strokeWidth="2" />
      <rect x="40" y="54" width="10" height="12" fill="#4b5563" rx="2" />
      <text x="30" y="50" fontSize="8" fill="#9ca3af" fontFamily="monospace">OSC1</text>

      {/* Right lead */}
      <line x1="140" y1="60" x2="170" y2="60" stroke="#d1d5db" strokeWidth="2" />
      <rect x="170" y="54" width="10" height="12" fill="#4b5563" rx="2" />
      <text x="180" y="50" fontSize="8" fill="#9ca3af" fontFamily="monospace">OSC2</text>

      {/* Capacitors */}
      {/* C1 left */}
      <rect x="25" y="85" width="20" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <text x="35" y="102" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">22pF</text>
      <line x1="45" y1="89" x2="60" y2="89" stroke="#d1d5db" strokeWidth="1" />
      <line x1="60" y1="80" x2="60" y2="100" stroke="#d1d5db" strokeWidth="1" />
      <text x="60" y="110" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">GND</text>

      {/* C2 right */}
      <rect x="175" y="85" width="20" height="8" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <text x="185" y="102" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">22pF</text>
      <line x1="160" y1="89" x2="175" y2="89" stroke="#d1d5db" strokeWidth="1" />
      <line x1="160" y1="80" x2="160" y2="100" stroke="#d1d5db" strokeWidth="1" />
      <text x="160" y="110" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">GND</text>
    </svg>
  );
};

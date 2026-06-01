'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LcdDisplay } from '@/components/hardware/LcdDisplay';
import { HwButton } from '@/components/hardware/HwButton';
import { useClockStore } from '@/store/useClockStore';
import { useInterruptTimer } from '@/hooks/useInterruptTimer';

export const CircuitSimulation: React.FC = () => {
  const t = useTranslations('simulation');
  useInterruptTimer();
  const isRunning = useClockStore((s) => s.isRunning);
  const toggleRunning = useClockStore((s) => s.toggleRunning);
  const kesmeSayaci = useClockStore((s) => s.kesme_sayaci);

  return (
    <section id="simulation" className="relative py-24 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-cyan-500/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-slate-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {t('title').split(' ').slice(0, -1).join(' ')} <span className="text-cyan-400">{t('title').split(' ').slice(-1)}</span>
        </motion.h2>
        <motion.p
          className="text-slate-400 max-w-2xl mx-auto mb-14 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('description')}
        </motion.p>

        {/* Glass panel with gradient border */}
        <motion.div
          className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-1 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 rounded-3xl pointer-events-none" />
          <div className="relative bg-slate-950/60 border border-slate-800/50 rounded-[22px] p-8 md:p-12">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            {/* Status bar */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-3 bg-slate-800/70 rounded-full px-6 py-2.5 border border-slate-700/60 shadow-inner">
                <span className={`relative flex h-3 w-3`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-green-500' : 'bg-red-500'}`} />
                </span>
                <span className="text-xs text-slate-300 font-mono uppercase tracking-wider">
                  {isRunning ? t('status.active') : t('status.stopped')}
                </span>
              </div>
              <button
                onClick={toggleRunning}
                className="text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all border border-slate-600 hover:border-slate-500 shadow-lg active:scale-95"
              >
                {isRunning ? t('status.stop') : t('status.start')}
              </button>
            </div>

            {/* LCD */}
            <div className="w-full max-w-2xl mx-auto mb-10">
              <LcdDisplay />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {[1, 2, 3, 4].map((id) => {
                const labels: Record<number, string> = {
                  1: t('labels.hourUp'),
                  2: t('labels.hourDown'),
                  3: t('labels.minUp'),
                  4: t('labels.minDown'),
                };
                return (
                  <motion.div
                    key={id}
                    className="w-28 md:w-32"
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <HwButton label={labels[id]} btnId={id as 1 | 2 | 3 | 4} />
                  </motion.div>
                );
              })}
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <span className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 font-mono shadow-sm">
                {t('chips.interruptCounter')}: {kesmeSayaci}/20
              </span>
              <span className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 font-mono shadow-sm">
                {t('chips.xtalFreq')}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 font-mono shadow-sm">
                {t('chips.lcdMode')}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 font-mono shadow-sm">
                {t('chips.compiler')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

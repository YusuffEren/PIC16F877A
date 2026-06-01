'use client';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Breadboard } from '@/components/hardware/Breadboard';
import { Pic16f877a } from '@/components/hardware/Pic16f877a';
import { LcdDisplay } from '@/components/hardware/LcdDisplay';
import { Crystal } from '@/components/hardware/Crystal';
import { HwButton } from '@/components/hardware/HwButton';

export const Hero: React.FC = () => {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

      tl.fromTo('.hero-breadboard', { opacity: 0, y: -120, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 1 })
        .fromTo('.hero-pic', { opacity: 0, x: -140, rotation: -8 }, { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, '-=0.5')
        .fromTo('.hero-crystal', { opacity: 0, y: -80, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'bounce.out' }, '-=0.4')
        .fromTo('.hero-lcd', { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(2)' }, '-=0.3')
        .fromTo('.hero-trace', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06 }, '-=0.3')
        .fromTo('.hero-buttons', { opacity: 0, x: 100, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)' }, '-=0.5')
        .fromTo('.hero-title-char', { opacity: 0, y: 20, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.04, stagger: 0.03, ease: 'power2.out' }, '-=0.2')
        .fromTo('.hero-subtitle', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')
        .call(() => setBooted(true), [], '+=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const titleText = t('title');

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold text-slate-100 tracking-tight mb-4 whitespace-nowrap">
            {titleText.split('').map((char, i) => (
              <span key={i} className="hero-title-char inline-block" style={{ opacity: 0 }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle text-slate-400 text-lg max-w-2xl mx-auto" style={{ opacity: 0 }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Assembly stage */}
        <div className="relative w-full aspect-[2/1] bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Breadboard */}
          <div className="hero-breadboard absolute inset-4 opacity-0">
            <Breadboard />
          </div>

          {/* PIC placed center-top */}
          <div className="hero-pic absolute left-[36%] top-[8%] w-[14%] h-[55%] opacity-0 z-10">
            <Pic16f877a />
          </div>

          {/* Crystal placed top-right */}
          <div className="hero-crystal absolute right-[14%] top-[6%] w-[26%] h-[20%] opacity-0 z-10">
            <Crystal />
          </div>

          {/* LCD placed middle */}
          <div className="hero-lcd absolute left-[16%] top-[36%] w-[68%] h-[36%] opacity-0 z-20">
            <LcdDisplay />
            {booted && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.15, 0.05, 0.12, 0] }}
                transition={{ duration: 1.5, times: [0, 0.2, 0.4, 0.6, 1] }}
                style={{ boxShadow: 'inset 0 0 40px 10px rgba(6,182,212,0.3)' }}
              />
            )}
          </div>

          {/* Wire traces from buttons toward PIC */}
          <svg className="hero-trace absolute inset-0 w-full h-full pointer-events-none opacity-0 z-[5]">
            <path d="M 170 370 L 170 320 L 320 320 L 320 220" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
            <path d="M 275 370 L 275 330 L 340 330 L 340 220" fill="none" stroke="#f87171" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
            <path d="M 465 370 L 465 330 L 400 330 L 400 220" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
            <path d="M 570 370 L 570 320 L 420 320 L 420 220" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
          </svg>

          {/* Buttons row with callout badges */}
          <div className="hero-buttons absolute left-[12%] bottom-[4%] w-[16%] h-[18%] opacity-0 z-20">
            <HwButton label={t('labels.hourUp')} btnId={1} />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap">
              {t('badges.hourUp')}
            </div>
          </div>
          <div className="hero-buttons absolute left-[29%] bottom-[4%] w-[16%] h-[18%] opacity-0 z-20">
            <HwButton label={t('labels.hourDown')} btnId={2} />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-300 text-[9px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap">
              {t('badges.hourDown')}
            </div>
          </div>
          <div className="hero-buttons absolute left-[55%] bottom-[4%] w-[16%] h-[18%] opacity-0 z-20">
            <HwButton label={t('labels.minUp')} btnId={3} />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap">
              {t('badges.minUp')}
            </div>
          </div>
          <div className="hero-buttons absolute left-[72%] bottom-[4%] w-[16%] h-[18%] opacity-0 z-20">
            <HwButton label={t('labels.minDown')} btnId={4} />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[9px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap">
              {t('badges.minDown')}
            </div>
          </div>
        </div>

        {/* Bottom legend */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <span className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> {t('legend.hourUp')}
          </span>
          <span className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-400" /> {t('legend.hourDown')}
          </span>
          <span className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> {t('legend.minUp')}
          </span>
          <span className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-violet-400" /> {t('legend.minDown')}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

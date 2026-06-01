'use client';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ExplanationCard } from '@/components/ui/ExplanationCard';
import { Pic16f877a } from '@/components/hardware/Pic16f877a';
import { LcdDisplay } from '@/components/hardware/LcdDisplay';
import { Crystal } from '@/components/hardware/Crystal';
import { HwButton } from '@/components/hardware/HwButton';
import { projectCCode } from '@/data/projectCode';

gsap.registerPlugin(ScrollTrigger);

export const CodeReview: React.FC = () => {
  const t = useTranslations('walkthrough');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeHw, setActiveHw] = useState<string | null>(null);

  const codeSections = [
    {
      id: 'config',
      code: projectCCode.split('\n').slice(0, 18).join('\n'),
      highlightLines: Array.from({ length: 18 }, (_, i) => i + 1),
    },
    {
      id: 'lcd',
      code: projectCCode.split('\n').slice(19, 52).join('\n'),
      highlightLines: Array.from({ length: 33 }, (_, i) => i + 1),
    },
    {
      id: 'timer',
      code: projectCCode.split('\n').slice(53, 70).join('\n'),
      highlightLines: Array.from({ length: 17 }, (_, i) => i + 1),
    },
    {
      id: 'buttons',
      code: projectCCode.split('\n').slice(71).join('\n'),
      highlightLines: Array.from({ length: 40 }, (_, i) => i + 1),
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      codeSections.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: sectionRef.current!.querySelector(`#walk-${id}`),
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveHw(id),
          onEnterBack: () => setActiveHw(id),
          onLeave: () => setActiveHw((prev) => (prev === id ? null : prev)),
          onLeaveBack: () => setActiveHw((prev) => (prev === id ? null : prev)),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isActive = (id: string) => activeHw === id;

  return (
    <section ref={sectionRef} id="code-walkthrough" className="relative bg-slate-950 py-24">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">
            {t('title').split(' ').slice(0, -1).join(' ')} <span className="text-cyan-400">{t('title').split(' ').slice(-1)}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {t('description')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Left: Sticky Hardware */}
          <div className="lg:w-2/5">
            <div className="lg:sticky lg:top-28 flex flex-col items-center gap-8 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{t('hardwarePanel')}</h3>

              <motion.div
                className="relative w-36 cursor-default"
                animate={{
                  scale: isActive('config') ? 1.12 : 0.88,
                  opacity: isActive('config') ? 1 : 0.45,
                  filter: isActive('config')
                    ? 'drop-shadow(0 0 20px rgba(34,211,238,0.7))'
                    : 'drop-shadow(0 0 0px rgba(34,211,238,0))',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                {isActive('config') && (
                  <motion.div className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
                )}
                <Pic16f877a />
              </motion.div>

              <motion.div
                className="relative w-44 cursor-default"
                animate={{
                  scale: isActive('timer') ? 1.12 : 0.88,
                  opacity: isActive('timer') ? 1 : 0.45,
                  filter: isActive('timer')
                    ? 'drop-shadow(0 0 20px rgba(34,211,238,0.7))'
                    : 'drop-shadow(0 0 0px rgba(34,211,238,0))',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                {isActive('timer') && (
                  <motion.div className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
                )}
                <Crystal />
              </motion.div>

              <motion.div
                className="relative w-full max-w-xs cursor-default"
                animate={{
                  scale: isActive('lcd') ? 1.08 : 0.9,
                  opacity: isActive('lcd') ? 1 : 0.45,
                  filter: isActive('lcd')
                    ? 'drop-shadow(0 0 24px rgba(34,211,238,0.7))'
                    : 'drop-shadow(0 0 0px rgba(34,211,238,0))',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                {isActive('lcd') && (
                  <motion.div className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
                )}
                <LcdDisplay />
              </motion.div>

              <motion.div
                className="relative flex gap-3 cursor-default"
                animate={{
                  scale: isActive('buttons') ? 1.08 : 0.9,
                  opacity: isActive('buttons') ? 1 : 0.45,
                  filter: isActive('buttons')
                    ? 'drop-shadow(0 0 20px rgba(34,211,238,0.7))'
                    : 'drop-shadow(0 0 0px rgba(34,211,238,0))',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                {isActive('buttons') && (
                  <motion.div className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} />
                )}
                <div className="w-16"><HwButton label="Saat +" btnId={1} /></div>
                <div className="w-16"><HwButton label="Saat -" btnId={2} /></div>
                <div className="w-16"><HwButton label="Dak +" btnId={3} /></div>
                <div className="w-16"><HwButton label="Dak -" btnId={4} /></div>
              </motion.div>
            </div>
          </div>

          {/* Right: Scrolling Code + Explanations */}
          <div className="lg:w-3/5 flex flex-col gap-14">
            {codeSections.map((sec, idx) => {
              const sectionKey = sec.id as 'config' | 'lcd' | 'timer' | 'buttons';
              return (
                <motion.div
                  key={sec.id}
                  id={`walk-${sec.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-cyan-400 mb-5 flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                      {idx + 1}
                    </span>
                    {t(`sections.${sectionKey}.title`)}
                  </h3>
                  <CodeBlock code={sec.code} highlightLines={sec.highlightLines} title={`main.c — ${t(`sections.${sectionKey}.title`)}`} />
                  <ExplanationCard
                    title={t(`sections.${sectionKey}.explanation.title`)}
                    paragraphs={[
                      t(`sections.${sectionKey}.explanation.paragraphs.0`),
                      t(`sections.${sectionKey}.explanation.paragraphs.1`),
                    ]}
                    bullets={[
                      t(`sections.${sectionKey}.explanation.bullets.0`),
                      t(`sections.${sectionKey}.explanation.bullets.1`),
                      t(`sections.${sectionKey}.explanation.bullets.2`),
                      t(`sections.${sectionKey}.explanation.bullets.3`),
                    ]}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

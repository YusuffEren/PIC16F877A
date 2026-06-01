'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const Footer: React.FC = () => {
  const t = useTranslations('footer');

  const tags = [
    t('tags.0'),
    t('tags.1'),
    t('tags.2'),
    t('tags.3'),
    t('tags.4'),
    t('tags.5'),
    t('tags.6'),
    t('tags.7'),
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/60 py-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h4
          className="text-xl font-semibold text-slate-100 mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h4>

        <motion.div
          className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="hover:text-cyan-400 transition-colors">{t('members.0')}</span>
          <span className="hover:text-cyan-400 transition-colors">{t('members.1')}</span>
          <span className="hover:text-cyan-400 transition-colors">{t('members.2')}</span>
          <span className="hover:text-cyan-400 transition-colors">{t('members.3')}</span>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 hover:text-cyan-300 transition-all">
              {tag}
            </span>
          ))}
        </motion.div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('university')}
          <br />
          {t('project')}
        </p>
      </div>
    </footer>
  );
};

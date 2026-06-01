'use client';
import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
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
          Proje Ekibi — Takım 5-56
        </motion.h4>

        <motion.div
          className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="hover:text-cyan-400 transition-colors">Mehmet Harun Dedecengiz</span>
          <span className="hover:text-cyan-400 transition-colors">Kıraç Çağıl Aslan</span>
          <span className="hover:text-cyan-400 transition-colors">Yusuf Eren Bozkurt</span>
          <span className="hover:text-cyan-400 transition-colors">Alper Tekin</span>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {['XC8 Derleyici', 'MPLAB X IDE', 'Proteus Simülasyon', 'Next.js 16', 'Tailwind CSS', 'Zustand', 'GSAP', 'Framer Motion'].map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 hover:text-cyan-300 transition-all">
              {tag}
            </span>
          ))}
        </motion.div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Manisa Celal Bayar Üniversitesi — Elektrik Elektronik Mühendisliği & Bilgisayar Mühendisliği
          <br />
          Disiplinler Arası Proje — 2025-2026
        </p>
      </div>
    </footer>
  );
};

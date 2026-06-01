'use client';
import React from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export const LanguageSwitcher: React.FC = () => {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const next = locale === 'tr' ? 'en' : 'tr';
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={switchLocale}
      className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-full text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shadow-lg"
      aria-label={t('langSwitcher')}
    >
      <span className={`w-2 h-2 rounded-full ${locale === 'tr' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
      {locale === 'tr' ? 'TR → EN' : 'EN → TR'}
    </button>
  );
};

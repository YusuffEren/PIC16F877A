'use client';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ExplanationCard } from '@/components/ui/ExplanationCard';
import { Pic16f877a } from '@/components/hardware/Pic16f877a';
import { LcdDisplay } from '@/components/hardware/LcdDisplay';
import { Crystal } from '@/components/hardware/Crystal';
import { HwButton } from '@/components/hardware/HwButton';
import { projectCCode } from '@/data/projectCode';

gsap.registerPlugin(ScrollTrigger);

interface CodeSectionData {
  id: string;
  title: string;
  code: string;
  highlightLines: number[];
  hwSelector: string;
  explanation: {
    title: string;
    paragraphs: string[];
    bullets?: string[];
  };
}

const codeSections: CodeSectionData[] = [
  {
    id: 'config',
    title: 'Konfigürasyon ve Pin Tanımları',
    code: projectCCode.split('\n').slice(0, 18).join('\n'),
    highlightLines: Array.from({ length: 18 }, (_, i) => i + 1),
    hwSelector: 'pic',
    explanation: {
      title: 'Bu bölüm ne yapıyor?',
      paragraphs: [
        'Mikrodenetleyici çalışmaya başlamadan önce donanımın nasıl davranacağını belirten konfigürasyon bitleri ayarlanır. `#pragma config` satırları ile osilatör modu (HS — High Speed), watchdog timer (WDTE) ve güç açılış zamanlayıcısı (PWRTE) gibi temel sistem ayarları yapılır.',
        'Pin tanımları sayesinde kodun geri kalanında `RS`, `EN`, `D4` gibi anlamlı isimler kullanılarak donanım okunabilir hale gelir. LCD ekran PORTD ve PORTC üzerinden, butonlar ise PORTB (RB0–RB3) üzerinden kontrol edilir. Böylece yazılım ile donanım arasında birebir eşleme sağlanır.',
      ],
      bullets: [
        'HS modu, 20 MHz kristal ile yüksek hızda çalışmayı sağlar.',
        'WDTE = OFF ile cihaz kendi kendine sıfırlanmaz.',
        'LVP = OFF ile düşük voltaj programlama devre dışı bırakılır.',
        'Butonlar `TRISB = 0x0F` ile giriş (input), LCD pinleri `TRISD = 0x00` ile çıkış (output) olarak ayarlanır.',
      ],
    },
  },
  {
    id: 'lcd',
    title: 'LCD Hazırlık ve Komut Fonksiyonları',
    code: projectCCode.split('\n').slice(19, 52).join('\n'),
    highlightLines: Array.from({ length: 33 }, (_, i) => i + 1),
    hwSelector: 'lcd',
    explanation: {
      title: 'LCD nasıl çalışıyor?',
      paragraphs: [
        'LCD ekran 4-bit modda çalıştırılmıştır. Bu, 8 veri hattı yerine sadece D4–D7 pinleri kullanılarak PIC üzerinde pin tasarrufu sağlar. Her komut veya karakter, önce yüksek 4 bit sonra düşük 4 bit olarak iki parça halinde gönderilir.',
        '`Lcd_Hazirla()` fonksiyonu ekranı başlatmak için gerekli sıralı komutları (0x30, 0x20, 0x28, 0x0C, 0x06, 0x01) gönderir. `0x28` 4-bit modu ve 2 satırı, `0x0C` ekranı açıp imleci gizler, `0x01` ekranı temizler. `Lcd_Git()` ise satır ve sütun bazında imleç konumlandırması yapar.',
      ],
      bullets: [
        '4-bit mod: Veri ikiye bölünerek gönderilir, 8 pine ihtiyaç duyulmaz.',
        'RS = 0 → Komut, RS = 1 → Veri (karakter) gönderimi.',
        'EN pininde kısa bir darbe (pulse) ile LCD komutu okur.',
        'Her komut sonrası 2ms gecikme, LCD\nin işlemi tamamlaması için beklenir.',
      ],
    },
  },
  {
    id: 'timer',
    title: 'Timer1 Kesmesi (Interrupt)',
    code: projectCCode.split('\n').slice(53, 70).join('\n'),
    highlightLines: Array.from({ length: 17 }, (_, i) => i + 1),
    hwSelector: 'crystal',
    explanation: {
      title: 'Timer1 kesmesi nasıl zamanı sayıyor?',
      paragraphs: [
        '20 MHz kristal ile Timer1, bölücü (prescaler) 1:8 ayarında yaklaşık her 50 milisaniyede bir taşma (overflow) yapar. Kesme servis rutini (`__interrupt`) her taşmada çalışır ve `kesme_sayaci` adlı bir sayaç değişkenini bir artırır.',
        'Sayaç 20\'ye ulaştığında (20 × 50 ms = 1000 ms = 1 saniye) gerçek bir saniye geçmiş olur. Bu anda saniye değeri artırılır, 60\'ı geçerse dakiye, dakika 60\'ı geçerse saat artırılır. Saat 24\'e ulaştığında sıfırlanarak 00:00\'a döner. Tüm bu taşıma kontrolleri kesme içinde otomatik olarak yapılır.',
      ],
      bullets: [
        'TMR1H = 0x86 ve TMR1L = 0x02 değerleri, 50 ms taşma süresi için önceden hesaplanmış başlangıç değerleridir.',
        'TMR1IF = 0 ile kesme bayrağı temizlenir, bir sonraki taşmayı bekler.',
        'GIE = 1 (Global Interrupt Enable) ile kesmeler aktif hale getirilir.',
        'Kesme rutini, main döngüsünden bağımsız çalışır; bu sayede saat arka planda güncellenir.',
      ],
    },
  },
  {
    id: 'buttons',
    title: 'Main Loop ve Buton Kontrolleri',
    code: projectCCode.split('\n').slice(71).join('\n'),
    highlightLines: Array.from({ length: 40 }, (_, i) => i + 1),
    hwSelector: 'buttons',
    explanation: {
      title: 'Butonlar ve debounce (bas-çek) nedir?',
      paragraphs: [
        'Mekanik butonlar basıldığında kısa süreli titreşimler (sönümlemeler) yapar. Bu titreşimler mikrodenetleyiciye çok sayıda "basılıp bırakıldı" sinyali gönderebilir. Bu istenmeyen tekrarları önlemek için "yükselen kenar algılama" (rising-edge detection) kullanılır.',
        '`b1_eski`, `b2_eski` gibi değişkenler butonun bir önceki durumunu saklar. `if (B_SAAT_ARTIR == 1 && b1_eski == 0)` koşulu, buton yeni basıldığında (önceki durum 0, şu anki durum 1) sadece bir kez işlem yapılmasını sağlar. Böylece butona basılı tutulsa bile değer sadece bir defa artar veya azalır.',
      ],
      bullets: [
        'Bas-çek (debounce): Butonun mekanik titreşimlerinden kaynaklanan yanlış okumaları engeller.',
        'Yükselen kenar: Sinyalin 0\'dan 1\'e geçtiği anı yakalar.',
        'Saat azaltma işleminde 0 sınırı kontrol edilir; 0\'dan azaltılırsa 23\'e döner (modüler aritmetik).',
        'Dakika artırma/eksiltme işlemlerinde saat değeri de taşma taşıma kontrolü ile güncellenir.',
      ],
    },
  },
];

export const CodeReview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeHw, setActiveHw] = useState<string | null>(null);

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
      {/* Ambient glow behind hardware panel */}
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
            Kod ve Donanım <span className="text-cyan-400">Yürüyüşü</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Aşağı kaydırarak C kodunun her bölümünü inceleyin. Sol taraftaki devre parçaları,
            ekrandaki ilgili kod bloğuyla senkronize olarak vurgulanır.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Left: Sticky Hardware */}
          <div className="lg:w-2/5">
            <div className="lg:sticky lg:top-28 flex flex-col items-center gap-8 bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Donanım Görünümü</h3>

              {/* PIC */}
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
                  <motion.div
                    className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <Pic16f877a />
              </motion.div>

              {/* Crystal */}
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
                  <motion.div
                    className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <Crystal />
              </motion.div>

              {/* LCD */}
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
                  <motion.div
                    className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <LcdDisplay />
              </motion.div>

              {/* Buttons */}
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
                  <motion.div
                    className="absolute -inset-4 rounded-2xl border-2 border-cyan-400/40 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
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
            {codeSections.map((sec, idx) => (
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
                  {sec.title}
                </h3>
                <CodeBlock code={sec.code} highlightLines={sec.highlightLines} title={`main.c — ${sec.title}`} />
                <ExplanationCard
                  title={sec.explanation.title}
                  paragraphs={sec.explanation.paragraphs}
                  bullets={sec.explanation.bullets}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

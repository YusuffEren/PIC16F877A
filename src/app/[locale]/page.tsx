import { Hero } from '@/components/sections/Hero';
import { CircuitSimulation } from '@/components/sections/CircuitSimulation';
import { CodeReview } from '@/components/sections/CodeReview';
import { Footer } from '@/components/sections/Footer';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function Home() {
  return (
    <main className="flex flex-col bg-slate-950 text-slate-100">
      <LanguageSwitcher />
      <Hero />
      <CircuitSimulation />
      <CodeReview />
      <Footer />
    </main>
  );
}

import { useEffect, useRef } from 'react';
import { useClockStore } from '@/store/useClockStore';

export function useInterruptTimer() {
  const tick = useClockStore((s) => s.tick);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // C kodundaki 50ms periyot (20 kesme = 1 sn)
    intervalRef.current = setInterval(() => {
      tick();
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);
}

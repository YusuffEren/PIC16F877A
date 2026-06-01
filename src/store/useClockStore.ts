import { create } from 'zustand';

interface ClockState {
  saat: number;
  dakika: number;
  saniye: number;
  kesme_sayaci: number;
  isRunning: boolean;
  b1_eski: number;
  b2_eski: number;
  b3_eski: number;
  b4_eski: number;

  tick: () => void;
  toggleRunning: () => void;
  incrementHour: () => void;
  decrementHour: () => void;
  incrementMinute: () => void;
  decrementMinute: () => void;
  setButtonState: (btn: 1 | 2 | 3 | 4, state: number) => void;
}

export const useClockStore = create<ClockState>((set, get) => ({
  saat: 12,
  dakika: 0,
  saniye: 0,
  kesme_sayaci: 0,
  isRunning: true,
  b1_eski: 0,
  b2_eski: 0,
  b3_eski: 0,
  b4_eski: 0,

  tick: () => {
    const state = get();
    if (!state.isRunning) return;

    let newKesme = state.kesme_sayaci + 1;
    let newSn = state.saniye;
    let newDak = state.dakika;
    let newSaat = state.saat;

    // 20 x 50ms = 1000ms (1 sn)
    if (newKesme >= 20) {
      newKesme = 0;
      newSn++;
      if (newSn >= 60) {
        newSn = 0;
        newDak++;
        if (newDak >= 60) {
          newDak = 0;
          newSaat++;
          if (newSaat >= 24) newSaat = 0;
        }
      }
    }

    set({
      kesme_sayaci: newKesme,
      saniye: newSn,
      dakika: newDak,
      saat: newSaat,
    });
  },

  toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

  incrementHour: () =>
    set((s) => {
      if (s.b1_eski === 0) {
        return { saat: (s.saat + 1) % 24, b1_eski: 1 };
      }
      return { b1_eski: 1 };
    }),

  decrementHour: () =>
    set((s) => {
      if (s.b2_eski === 0) {
        return { saat: s.saat === 0 ? 23 : s.saat - 1, b2_eski: 1 };
      }
      return { b2_eski: 1 };
    }),

  incrementMinute: () =>
    set((s) => {
      if (s.b3_eski === 0) {
        let newDak = s.dakika + 1;
        let newSaat = s.saat;
        if (newDak >= 60) {
          newDak = 0;
          newSaat = (newSaat + 1) % 24;
        }
        return { dakika: newDak, saat: newSaat, b3_eski: 1 };
      }
      return { b3_eski: 1 };
    }),

  decrementMinute: () =>
    set((s) => {
      if (s.b4_eski === 0) {
        let newDak = s.dakika;
        let newSaat = s.saat;
        if (newDak === 0) {
          newDak = 59;
          newSaat = newSaat === 0 ? 23 : newSaat - 1;
        } else {
          newDak--;
        }
        return { dakika: newDak, saat: newSaat, b4_eski: 1 };
      }
      return { b4_eski: 1 };
    }),

  setButtonState: (btn, state) => {
    if (btn === 1) set({ b1_eski: state });
    if (btn === 2) set({ b2_eski: state });
    if (btn === 3) set({ b3_eski: state });
    if (btn === 4) set({ b4_eski: state });
  },
}));

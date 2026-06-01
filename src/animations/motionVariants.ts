export const buttonTap = {
  whileTap: { scale: 0.92, transition: { duration: 0.1 } },
};

export const pulseSignal = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5], transition: { duration: 0.6 } },
};

export const lcdUpdate = {
  initial: { opacity: 0.5, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
};

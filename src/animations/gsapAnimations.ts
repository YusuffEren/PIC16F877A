import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function createAssemblyTimeline(container: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    container.querySelectorAll('.hw-breadboard'),
    { opacity: 0, scale: 0.8, y: -50 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8 }
  )
    .fromTo(
      container.querySelectorAll('.hw-pic'),
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(
      container.querySelectorAll('.hw-crystal'),
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    )
    .fromTo(
      container.querySelectorAll('.hw-lcd'),
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7 },
      '-=0.3'
    )
    .fromTo(
      container.querySelectorAll('.hw-buttons'),
      { opacity: 0, x: 80 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
      '-=0.4'
    )
    .fromTo(
      container.querySelectorAll('.hw-lcd-backlight'),
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.inOut' },
      '-=0.2'
    );

  return tl;
}

export function createCodeWalkthroughTimeline(
  section: HTMLElement,
  onHighlight: (id: string) => void,
  onClear: () => void
) {
  const steps = [
    { trigger: '.code-config', hw: '.hw-pic' },
    { trigger: '.code-lcd', hw: '.hw-lcd' },
    { trigger: '.code-timer', hw: '.hw-crystal' },
    { trigger: '.code-buttons', hw: '.hw-buttons' },
  ];

  steps.forEach(({ trigger, hw }) => {
    ScrollTrigger.create({
      trigger: section.querySelector(trigger),
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        onHighlight(hw);
        gsap.to(section.querySelectorAll(hw), {
          filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.8))',
          duration: 0.4,
        });
      },
      onLeave: () => {
        onClear();
        gsap.to(section.querySelectorAll(hw), {
          filter: 'drop-shadow(0 0 0px rgba(34,211,238,0))',
          duration: 0.4,
        });
      },
      onEnterBack: () => {
        onHighlight(hw);
        gsap.to(section.querySelectorAll(hw), {
          filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.8))',
          duration: 0.4,
        });
      },
      onLeaveBack: () => {
        onClear();
        gsap.to(section.querySelectorAll(hw), {
          filter: 'drop-shadow(0 0 0px rgba(34,211,238,0))',
          duration: 0.4,
        });
      },
    });
  });
}

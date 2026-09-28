/**
 * Central motion system — intentional, reduced-motion safe.
 * Durations: 180 / 280 / 400ms. Easing: soft editorial.
 */

import type { Transition, Variants } from 'framer-motion';

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.28,
  slow: 0.4,
} as const;

export function transition(
  duration: number = DURATION.base,
  reduced = false
): Transition {
  if (reduced) return { duration: 0 };
  return { duration, ease: EASE_EDITORIAL };
}

/** Section enter — use with whileInView once */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

/** Instant when reduced motion — swap via hook in components */
export const fadeUpReduced: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const staggerChildrenReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

export const navReveal: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

export const scoreUpdateFlash: Variants = {
  idle: { opacity: 1, scale: 1 },
  flash: {
    opacity: [1, 0.7, 1],
    scale: [1, 1.03, 1],
    transition: { duration: DURATION.base, ease: EASE_EDITORIAL },
  },
};

export function sectionVariants(reduced: boolean): Variants {
  return reduced ? fadeUpReduced : fadeUp;
}

export function listVariants(reduced: boolean): Variants {
  return reduced ? staggerChildrenReduced : staggerChildren;
}

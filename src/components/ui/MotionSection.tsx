'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  DURATION,
  listVariants,
  sectionVariants,
  transition,
} from '@/lib/motion';
import { cn } from '@/lib/utils';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  /** Stagger child motion nodes inside */
  stagger?: boolean;
  as?: 'div' | 'section' | 'aside';
}

/**
 * Homepage section enter — once in view. Never fades LCP media from 0
 * (only the section wrapper; hero images stay fully opaque).
 */
export default function MotionSection({
  children,
  className,
  stagger = false,
  as = 'div',
}: MotionSectionProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger ? listVariants(!!reduced) : sectionVariants(!!reduced)}
      transition={transition(DURATION.base, !!reduced)}
    >
      {children}
    </Comp>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={sectionVariants(!!reduced)}
      transition={transition(DURATION.base, !!reduced)}
    >
      {children}
    </motion.div>
  );
}

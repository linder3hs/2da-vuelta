"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  useReducedMotion,
} from "framer-motion";

interface Props {
  value: number;
  decimals?: number;
  /** Intl.NumberFormat (es-PE) para enteros grandes */
  group?: boolean;
  suffix?: string;
  className?: string;
}

const fmtGroup = new Intl.NumberFormat("es-PE");

export default function AnimatedNumber({
  value,
  decimals = 0,
  group = false,
  suffix = "",
  className,
}: Props) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const display = useTransform(spring, (v) => {
    if (group) return fmtGroup.format(Math.round(v)) + suffix;
    return v.toFixed(decimals) + suffix;
  });
  const first = useRef(true);

  useEffect(() => {
    if (reduce || first.current) {
      mv.jump?.(value);
      mv.set(value);
      first.current = false;
    } else {
      mv.set(value);
    }
  }, [value, mv, reduce]);

  return <motion.span className={className}>{display}</motion.span>;
}

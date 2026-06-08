"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  label: string;
  value: number;
  decimals?: number;
  group?: boolean;
  suffix?: string;
  sub?: string;
  accent?: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  decimals = 0,
  group = false,
  suffix = "",
  sub,
  accent = "#38bdf8",
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
        <span className="text-xs font-medium uppercase tracking-wide text-white/45">
          {label}
        </span>
      </div>
      <div className="mt-3 text-2xl font-extrabold tabular-nums sm:text-3xl">
        <AnimatedNumber
          value={value}
          decimals={decimals}
          group={group}
          suffix={suffix}
        />
      </div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </motion.div>
  );
}

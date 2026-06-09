"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { REFRESH_MS } from "@/hooks/useElection";

interface Props {
  onRefresh: () => void;
  isValidating?: boolean;
}

const TOTAL = Math.round(REFRESH_MS / 1000);

export default function RefreshCountdown({ onRefresh, isValidating }: Props) {
  const [left, setLeft] = useState(TOTAL);

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => (s <= 1 ? TOTAL : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handle = useCallback(() => {
    setLeft(TOTAL);
    onRefresh();
  }, [onRefresh]);

  const pct = (left / TOTAL) * 100;

  return (
    <button
      onClick={handle}
      className="group inline-flex items-center gap-3 rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink/80 ring-1 ring-ink/10 transition hover:bg-ink/10 hover:text-ink"
      title="Actualizar ahora"
    >
      <span className="relative grid h-7 w-7 place-items-center">
        <svg className="h-7 w-7 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="3"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#cd-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 15}
            animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - pct / 100) }}
            transition={{ ease: "linear", duration: 1 }}
          />
          <defs>
            <linearGradient id="cd-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </svg>
        <span
          className={`absolute text-[10px] font-bold tabular-nums ${
            isValidating ? "animate-pulse text-rose-600" : "text-ink/70"
          }`}
        >
          {left}
        </span>
      </span>
      <span className="whitespace-nowrap">
        {isValidating ? "Actualizando…" : `Actualiza en ${left}s`}
      </span>
    </button>
  );
}

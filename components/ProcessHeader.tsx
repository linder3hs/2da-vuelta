"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Totales } from "@/lib/types";
import { formatDateTime, relativeTime } from "@/lib/format";
import LiveBadge from "./LiveBadge";
import RefreshCountdown from "./RefreshCountdown";
import ThemeToggle from "./ThemeToggle";

interface Props {
  totales?: Totales;
  live: boolean;
  onRefresh: () => void;
}

export default function ProcessHeader({ totales, live, onRefresh }: Props) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Antetítulo / kicker */}
      <div className="mb-3 flex items-center gap-3">
        <span className="eyebrow">Perú 2026 · Resultados oficiales ONPE</span>
        <span className="h-px flex-1 bg-ink/10" />
        <LiveBadge live={live} />
        <ThemeToggle />
      </div>

      {/* Titular serif */}
      <h1 className="font-serif text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-6xl">
        2da Vuelta de Elecciones Presidenciales 2026
      </h1>

      {/* Línea de crédito / dateline */}
      <div className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/55">
          Cómputo oficial en tiempo real · Fuente:{" "}
          <span className="font-semibold text-ink/80">ONPE</span>
          {totales?.fechaActualizacion && (
            <>
              {" · "}Actualizado{" "}
              <span className="font-semibold text-ink/80">
                {formatDateTime(totales.fechaActualizacion)}
              </span>
              {now !== null && (
                <span className="text-ink/45">
                  {" "}
                  ({relativeTime(totales.fechaActualizacion, now)})
                </span>
              )}
            </>
          )}
        </p>
        <RefreshCountdown onRefresh={onRefresh} isValidating={!live} />
      </div>
    </motion.header>
  );
}

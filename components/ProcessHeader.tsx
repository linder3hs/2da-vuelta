"use client";

import { motion } from "framer-motion";
import type { Totales } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import LiveBadge from "./LiveBadge";
import RefreshCountdown from "./RefreshCountdown";

interface Props {
  totales?: Totales;
  live: boolean;
  onRefresh: () => void;
}

export default function ProcessHeader({ totales, live, onRefresh }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Antetítulo / kicker */}
      <div className="mb-3 flex items-center gap-3">
        <span className="eyebrow">Perú 2026 · Resultados oficiales ONPE</span>
        <span className="h-px flex-1 bg-white/10" />
        <LiveBadge live={live} />
      </div>

      {/* Titular serif */}
      <h1 className="font-serif text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
        2da Vuelta de Elecciones Presidenciales 2026
      </h1>

      {/* Línea de crédito / dateline */}
      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">
          Cómputo oficial en tiempo real · Fuente:{" "}
          <span className="font-semibold text-white/80">ONPE</span>
          {totales?.fechaActualizacion && (
            <>
              {" · "}Actualizado{" "}
              <span className="font-semibold text-white/80">
                {formatDateTime(totales.fechaActualizacion)}
              </span>
            </>
          )}
        </p>
        <RefreshCountdown onRefresh={onRefresh} isValidating={!live} />
      </div>
    </motion.header>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Proceso, Totales } from "@/lib/types";
import { titleCase, formatDateTime } from "@/lib/format";
import LiveBadge from "./LiveBadge";
import RefreshCountdown from "./RefreshCountdown";

interface Props {
  proceso?: Proceso;
  totales?: Totales;
  live: boolean;
  onRefresh: () => void;
}

export default function ProcessHeader({
  proceso,
  totales,
  live,
  onRefresh,
}: Props) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2 flex items-center gap-3">
          <LiveBadge live={live} />
          {proceso?.acronimo && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/50 ring-1 ring-white/10">
              {proceso.acronimo}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
          <span className="text-gradient">
            {proceso ? titleCase(proceso.nombre) : "Segunda Vuelta 2026"}
          </span>
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Resultados en tiempo real · Fuente:{" "}
          <span className="font-medium text-white/70">ONPE</span>
          {totales?.fechaActualizacion && (
            <>
              {" · "}Actualizado:{" "}
              <span className="font-medium text-white/70">
                {formatDateTime(totales.fechaActualizacion)}
              </span>
            </>
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <RefreshCountdown onRefresh={onRefresh} isValidating={!live} />
      </motion.div>
    </header>
  );
}

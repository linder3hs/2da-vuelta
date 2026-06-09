"use client";

import { motion } from "framer-motion";
import type { Totales } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import StatCard from "./StatCard";

/** Barra de avance del conteo de actas (va al inicio). */
export function CountProgress({ t }: { t: Totales }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <h2 className="eyebrow">Avance del conteo · Actas contabilizadas</h2>
          <p className="mt-1 text-xs text-ink/45">
            {formatNumber(t.contabilizadas)} de {formatNumber(t.totalActas)} actas
          </p>
        </div>
        <div className="figure text-4xl font-black text-blue-500 sm:text-5xl">
          {t.actasContabilizadas.toFixed(2)}%
        </div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink/8 ring-1 ring-ink/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#3b82f6,#1e40af)" }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(t.actasContabilizadas, 0.4)}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        />
      </div>
    </div>
  );
}

/** Indicadores secundarios (participación, votos, JEE). */
export default function ProgressStats({ t }: { t: Totales }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Participación"
        value={t.participacionCiudadana}
        decimals={2}
        suffix="%"
        accent="#38bdf8"
        delay={0.05}
      />
      <StatCard
        label="Votos emitidos"
        value={t.totalVotosEmitidos}
        group
        sub={`${formatNumber(t.totalVotosValidos)} válidos`}
        accent="#a855f7"
        delay={0.1}
      />
      <StatCard
        label="Enviadas a JEE"
        value={t.actasEnviadasJee}
        decimals={2}
        suffix="%"
        sub={`${formatNumber(t.enviadasJee)} actas`}
        accent="#22c55e"
        delay={0.15}
      />
      <StatCard
        label="Pendientes JEE"
        value={t.actasPendientesJee}
        decimals={2}
        suffix="%"
        sub={`${formatNumber(t.pendientesJee)} actas`}
        accent="#eab308"
        delay={0.2}
      />
    </div>
  );
}

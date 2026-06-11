"use client";

import { motion } from "framer-motion";
import type { Totales } from "@/lib/types";
import { formatNumber } from "@/lib/format";

/** Tira compacta de avance del conteo (una línea + barra fina). */
export function CompactProgress({ t }: { t: Totales }) {
  const actasRestantes = Math.max(0, t.totalActas - t.contabilizadas);
  const avgPorActa =
    t.contabilizadas > 0 ? t.totalVotosEmitidos / t.contabilizadas : 0;
  const votosPorContar = Math.round(actasRestantes * avgPorActa);

  return (
    <div className="glass rounded-2xl px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">Avance del conteo</span>
        <span className="text-xs text-ink/45">
          {formatNumber(t.contabilizadas)} / {formatNumber(t.totalActas)} actas
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8 ring-1 ring-ink/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#3b82f6,#1e40af)" }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(t.actasContabilizadas, 0.4)}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
          />
        </div>
        <span className="figure shrink-0 text-xl font-black text-blue-500 tabular-nums">
          {t.actasContabilizadas.toFixed(3)}%
        </span>
      </div>
      {actasRestantes > 0 && (
        <p className="mt-2 text-xs text-ink/45">
          Faltan{" "}
          <span className="font-semibold text-ink/70">
            {formatNumber(actasRestantes)}
          </span>{" "}
          actas ·{" "}
          <span className="font-semibold text-ink/70">
            ≈ {formatNumber(votosPorContar)}
          </span>{" "}
          votos por contar{" "}
          <span className="text-ink/35">
            (estimado, ~{Math.round(avgPorActa)} votos/acta)
          </span>
        </p>
      )}
    </div>
  );
}

/** Indicadores en fila con filetes (estilo prensa). */
export default function Indicators({ t }: { t: Totales }) {
  const items = [
    {
      label: "Participación",
      value: `${t.participacionCiudadana.toFixed(3)}%`,
      sub: "ciudadana",
    },
    {
      label: "Votos emitidos",
      value: formatNumber(t.totalVotosEmitidos),
      sub: `${formatNumber(t.totalVotosValidos)} válidos`,
    },
    {
      label: "Actas enviadas a JEE",
      value: `${t.actasEnviadasJee.toFixed(3)}%`,
      sub: `${formatNumber(t.enviadasJee)} actas`,
    },
    {
      label: "Actas pendientes JEE",
      value: `${t.actasPendientesJee.toFixed(3)}%`,
      sub: `${formatNumber(t.pendientesJee)} actas`,
    },
  ];

  return (
    <div className="glass grid grid-cols-2 rounded-2xl lg:grid-cols-4">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`p-5 ${i % 2 === 1 ? "border-l border-ink/8" : ""} ${
            i >= 2 ? "border-t border-ink/8" : ""
          } lg:border-t-0 ${i > 0 ? "lg:border-l lg:border-ink/8" : ""}`}
        >
          <div className="eyebrow text-[10px]">{it.label}</div>
          <div className="figure mt-2 text-2xl font-black tabular-nums">
            {it.value}
          </div>
          <div className="mt-0.5 text-xs text-ink/45">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

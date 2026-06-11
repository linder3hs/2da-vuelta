"use client";

import type { Participante } from "@/lib/types";
import { partyStyle } from "@/lib/parties";
import { shortName, formatNumber } from "@/lib/format";

/** Tabla de resultados estilo prensa. */
export default function ResultsTable({ p }: { p: Participante[] }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      {/* Cabecera */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-ink/8 px-5 py-3 sm:grid-cols-[1fr_7rem_6rem_6rem]">
        <span className="eyebrow text-[10px]">Candidatura</span>
        <span className="eyebrow hidden text-right text-[10px] sm:block">Votos</span>
        <span className="eyebrow text-right text-[10px]">% válidos</span>
        <span className="eyebrow hidden text-right text-[10px] sm:block">% emitidos</span>
      </div>

      {p.map((c, i) => {
        const s = partyStyle(c.codigoAgrupacionPolitica);
        return (
          <div
            key={c.codigoAgrupacionPolitica}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[1fr_7rem_6rem_6rem] ${
              i > 0 ? "border-t border-ink/8" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-8 w-1.5 shrink-0 rounded-full"
                style={{ background: s.gradient }}
              />
              <div className="min-w-0">
                <div className="truncate font-serif text-sm font-bold">
                  {shortName(c.nombreCandidato)}
                </div>
                <div className="truncate text-[11px] uppercase tracking-wide text-ink/45">
                  {c.nombreAgrupacionPolitica}
                </div>
              </div>
            </div>
            <div className="hidden text-right text-sm tabular-nums text-ink/80 sm:block">
              {formatNumber(c.totalVotosValidos)}
            </div>
            <div
              className="figure text-right text-lg font-black tabular-nums"
              style={{ color: s.color }}
            >
              {c.porcentajeVotosValidos.toFixed(3)}%
            </div>
            <div className="hidden text-right text-sm tabular-nums text-ink/55 sm:block">
              {c.porcentajeVotosEmitidos.toFixed(3)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

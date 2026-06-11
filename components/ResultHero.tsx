"use client";

import { motion } from "framer-motion";
import type { Participante } from "@/lib/types";
import { partyStyle } from "@/lib/parties";
import { shortName, formatNumber } from "@/lib/format";
import Avatar from "./Avatar";

/** Bloque principal de resultado: las dos candidaturas + barra + ventaja. */
export default function ResultHero({ p }: { p: Participante[] }) {
  if (p.length < 2) return null;
  const [a, b] = p; // ordenado: a = líder
  const sa = partyStyle(a.codigoAgrupacionPolitica);
  const sb = partyStyle(b.codigoAgrupacionPolitica);
  const lead = a.porcentajeVotosValidos - b.porcentajeVotosValidos;
  const diff = Math.abs(a.totalVotosValidos - b.totalVotosValidos);

  return (
    <div className="glass rounded-3xl p-5 sm:p-8">
      {/* Candidaturas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Candidate p={a} s={sa} leader />
        <Candidate p={b} s={sb} align="right" />
      </div>

      {/* Barra de votos válidos */}
      <div className="relative mt-7">
        <div className="relative flex h-11 w-full overflow-hidden rounded-md ring-1 ring-ink/15">
          <motion.div
            className="h-full"
            style={{ background: sa.gradient }}
            initial={{ width: "50%" }}
            animate={{ width: `${a.porcentajeVotosValidos}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
          <motion.div
            className="h-full flex-1"
            style={{ background: sb.gradient }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/90 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/40" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2">
          <span className="eyebrow text-[10px] text-ink/45">Mayoría · 50%</span>
        </div>
      </div>

      {/* Diferencia — destacada */}
      <div className="mt-9 flex flex-col items-center">
        <span className="eyebrow text-[10px] text-ink/45">
          Diferencia de votos
        </span>
        <motion.span
          key={diff}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="figure mt-1 text-5xl font-black leading-none sm:text-6xl"
          style={{ color: sa.color }}
        >
          {formatNumber(diff)}
        </motion.span>
        <span className="mt-2 text-sm text-ink/60">
          a favor de{" "}
          <span className="font-semibold text-ink/90">
            {shortName(a.nombreCandidato)}
          </span>{" "}
          ·{" "}
          <span className="font-bold" style={{ color: sa.color }}>
            +{lead.toFixed(3)} pts
          </span>
        </span>
      </div>
    </div>
  );
}

function Candidate({
  p,
  s,
  leader = false,
  align = "left",
}: {
  p: Participante;
  s: ReturnType<typeof partyStyle>;
  leader?: boolean;
  align?: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div
      className={`flex items-center gap-4 ${right ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      <Avatar
        dni={p.dniCandidato}
        name={p.nombreCandidato}
        gradient={s.gradient}
        size={64}
      />
      <div className="min-w-0 flex-1">
        <div
          className={`flex items-center gap-2 ${right ? "sm:flex-row-reverse" : ""}`}
        >
          <h2 className="truncate font-serif text-lg font-bold leading-tight">
            {shortName(p.nombreCandidato)}
          </h2>
          {leader && (
            <span className="shrink-0 rounded-full bg-ink/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/70 ring-1 ring-ink/10">
              En cabeza
            </span>
          )}
        </div>
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink/45">
          {p.nombreAgrupacionPolitica}
        </p>
        <div
          className={`mt-1 flex items-baseline gap-2 ${right ? "sm:flex-row-reverse" : ""}`}
        >
          <span
            className="figure text-4xl font-black sm:text-5xl"
            style={{ color: s.color }}
          >
            {p.porcentajeVotosValidos.toFixed(3)}%
          </span>
          <span className="text-xs text-ink/45">
            {formatNumber(p.totalVotosValidos)} votos
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Participante } from "@/lib/types";
import { partyStyle } from "@/lib/parties";
import { shortName, formatNumber } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import Avatar from "./Avatar";

interface Props {
  p: Participante;
  rank: number; // 0 = líder
  delay?: number;
}

export default function CandidateCard({ p, rank, delay = 0 }: Props) {
  const s = partyStyle(p.codigoAgrupacionPolitica);
  const leader = rank === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="glass relative overflow-hidden rounded-3xl p-6"
      style={{
        boxShadow: leader
          ? `0 8px 40px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
          : undefined,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: s.gradient }}
      />
      {leader && (
        <span className="absolute right-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
          ★ En cabeza
        </span>
      )}

      <div className="flex items-center gap-4">
        <Avatar
          dni={p.dniCandidato}
          name={p.nombreCandidato}
          gradient={s.gradient}
          size={56}
        />
        <div className="min-w-0">
          <h3 className="truncate font-serif text-xl font-bold leading-tight">
            {shortName(p.nombreCandidato)}
          </h3>
          <p className="truncate text-xs font-medium uppercase tracking-wide text-white/45">
            {p.nombreAgrupacionPolitica}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <div
            className="figure text-5xl font-black"
            style={{ color: s.color }}
          >
            <AnimatedNumber value={p.porcentajeVotosValidos} decimals={2} suffix="%" />
          </div>
          <div className="text-xs text-white/45">votos válidos</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold tabular-nums text-white/90">
            <AnimatedNumber value={p.totalVotosValidos} group />
          </div>
          <div className="text-xs text-white/45">
            {formatNumber(p.totalVotosValidos)} votos
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-white/40">
        Equivale al {p.porcentajeVotosEmitidos.toFixed(2)}% de los votos emitidos
        (incluye blancos y nulos)
      </p>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { Participante } from "@/lib/types";
import { partyStyle } from "@/lib/parties";
import { shortName, formatNumber } from "@/lib/format";
import Avatar from "./Avatar";

interface Props {
  participantes: Participante[];
}

/** Barra comparativa horizontal por % de votos válidos. Foco principal. */
export default function HeadToHead({ participantes }: Props) {
  if (participantes.length < 2) return null;
  const [a, b] = participantes; // ya viene ordenado: a = líder
  const sa = partyStyle(a.codigoAgrupacionPolitica);
  const sb = partyStyle(b.codigoAgrupacionPolitica);
  const lead = a.porcentajeVotosValidos - b.porcentajeVotosValidos;
  const voteDiff = a.totalVotosValidos - b.totalVotosValidos;
  const leaderLastName = shortName(a.nombreCandidato);

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <Label p={a} color={sa.color} gradient={sa.gradient} align="left" />
        <Label p={b} color={sb.color} gradient={sb.gradient} align="right" />
      </div>

      <div className="relative flex h-9 w-full overflow-hidden rounded-full ring-1 ring-white/10">
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
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/40" />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          className="flex items-baseline gap-2 rounded-2xl px-4 py-2 ring-1"
          style={{
            background: `${sa.color}14`,
            borderColor: `${sa.color}40`,
          }}
        >
          <span className="text-xs text-white/55">Diferencia</span>
          <span
            className="text-xl font-extrabold tabular-nums sm:text-2xl"
            style={{ color: sa.color }}
          >
            {formatNumber(Math.abs(voteDiff))}
          </span>
          <span className="text-xs text-white/55">votos</span>
        </div>
        <p className="text-center text-xs text-white/50">
          Ventaja de{" "}
          <span className="font-semibold text-white/80">{leaderLastName}</span> ·{" "}
          <span className="font-semibold" style={{ color: sa.color }}>
            +{lead.toFixed(2)} pts
          </span>{" "}
          en votos válidos
        </p>
      </div>
    </div>
  );
}

function Label({
  p,
  color,
  gradient,
  align,
}: {
  p: Participante;
  color: string;
  gradient: string;
  align: "left" | "right";
}) {
  const right = align === "right";
  return (
    <div
      className={`flex items-center gap-3 ${right ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <Avatar
        dni={p.dniCandidato}
        name={p.nombreCandidato}
        gradient={gradient}
        size={48}
      />
      <div>
        <div
          className="text-2xl font-extrabold tabular-nums sm:text-3xl"
          style={{ color }}
        >
          {p.porcentajeVotosValidos.toFixed(2)}%
        </div>
        <div className="text-xs font-medium text-white/70">
          {shortName(p.nombreCandidato)}
        </div>
        <div className="text-[10px] uppercase tracking-wide text-white/40">
          {p.nombreAgrupacionPolitica}
        </div>
      </div>
    </div>
  );
}

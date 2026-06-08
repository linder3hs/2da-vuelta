export interface PartyStyle {
  color: string; // color sólido base
  gradient: string; // gradiente para barras/avatares
  glow: string; // sombra/halo
}

// Paleta por código de agrupación política (codigoAgrupacionPolitica).
const PARTY_STYLES: Record<number, PartyStyle> = {
  8: {
    // FUERZA POPULAR — naranja
    color: "#f97316",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
    glow: "rgba(249, 115, 22, 0.45)",
  },
  10: {
    // JUNTOS POR EL PERÚ — verde
    color: "#16a34a",
    gradient: "linear-gradient(135deg, #4ade80, #15803d)",
    glow: "rgba(22, 163, 74, 0.45)",
  },
};

// Paleta de respaldo determinística (por si aparece otro código).
const FALLBACK: PartyStyle[] = [
  {
    color: "#38bdf8",
    gradient: "linear-gradient(135deg, #7dd3fc, #0284c7)",
    glow: "rgba(56, 189, 248, 0.45)",
  },
  {
    color: "#a855f7",
    gradient: "linear-gradient(135deg, #c084fc, #7e22ce)",
    glow: "rgba(168, 85, 247, 0.45)",
  },
  {
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #4ade80, #15803d)",
    glow: "rgba(34, 197, 94, 0.45)",
  },
  {
    color: "#eab308",
    gradient: "linear-gradient(135deg, #fde047, #a16207)",
    glow: "rgba(234, 179, 8, 0.45)",
  },
];

export function partyStyle(codigo: number): PartyStyle {
  return PARTY_STYLES[codigo] ?? FALLBACK[Math.abs(codigo) % FALLBACK.length];
}

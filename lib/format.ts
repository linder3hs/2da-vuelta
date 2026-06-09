const numberFmt = new Intl.NumberFormat("es-PE");

/** Foto oficial del candidato por DNI (servida por ONPE). */
export function candidatePhoto(dni: string): string {
  return `https://resultadosegundavuelta.onpe.gob.pe/assets/img-reales/candidatos/${dni}.png`;
}

/** 53928 -> "53,928" */
export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

/** 45.579 -> "45.58%" (los % de ONPE ya vienen en escala 0–100) */
export function formatPercent(n: number, decimals = 2): string {
  return `${n.toFixed(decimals)}%`;
}

/** epoch ms -> "07/06/2026, 18:42:00" en hora de Perú */
export function formatDateTime(ms: number): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

/** epoch ms -> "hace 2 min" / "hace 30 s" / "hace 1 h" */
export function relativeTime(ms: number, now: number): string {
  const diff = Math.max(0, now - ms);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `hace ${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  return `hace ${h} h`;
}

/** epoch ms -> "18:42:00" en hora de Perú */
export function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

/** Iniciales para avatar: "KEIKO SOFIA FUJIMORI HIGUCHI" -> "KF" */
export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  // primer nombre + primer apellido (índice mitad, heurística simple)
  const first = parts[0];
  const last = parts[Math.floor(parts.length / 2)] ?? parts[parts.length - 1];
  return (first[0] + last[0]).toUpperCase();
}

/** "ROBERTO HELBERT SANCHEZ PALOMINO" -> "Roberto Helbert Sanchez Palomino" */
export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b[\p{L}]/gu, (c) => c.toUpperCase());
}

/**
 * Primer nombre + primer apellido.
 * "KEIKO SOFIA FUJIMORI HIGUCHI" -> "Keiko Fujimori".
 * Asume formato NOMBRES + APELLIDOS; el primer apellido está en la mitad.
 */
export function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return titleCase(fullName);
  const first = parts[0];
  const surname = parts[Math.floor(parts.length / 2)] ?? parts[parts.length - 1];
  return titleCase(`${first} ${surname}`);
}

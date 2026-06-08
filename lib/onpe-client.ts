// Fallback de cliente: si nuestro proxy /api falla (típico en producción/Vercel
// por geo-bloqueo de ONPE a IPs no peruanas), el navegador del visitante intenta
// llamar a ONPE directamente. Esto solo funciona si:
//   1) el visitante está en Perú (pasa el geo-bloqueo), y
//   2) ONPE permite CORS desde otros orígenes.
// Si CORS lo bloquea, el fetch lanza y SWR muestra el error (sin regresión).
import type { OnpeEnvelope } from "./types";

export const ONPE_PUBLIC_BASE =
  "https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error("ONPE devolvió HTML en lugar de JSON.");
  }
  return res.json() as Promise<T>;
}

/**
 * Intenta el proxy propio (devuelve `data` desempaquetada). Si falla, cae a
 * ONPE directo (devuelve el envelope `{ data }`) y desempaqueta.
 */
export async function proxyThenDirect<T>(
  proxyUrl: string,
  directPath: string,
): Promise<T> {
  try {
    return await getJSON<T>(proxyUrl);
  } catch {
    const env = await getJSON<OnpeEnvelope<T>>(
      `${ONPE_PUBLIC_BASE}${directPath}`,
    );
    if (!env.success) throw new Error(env.message || "ONPE success=false");
    return env.data;
  }
}

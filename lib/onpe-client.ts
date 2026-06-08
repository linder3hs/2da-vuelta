// Estrategia de obtención de datos en el cliente.
//
// En producción (Vercel) nuestro proxy /api NO alcanza ONPE (geo-bloqueo) y el
// fetch directo del navegador falla por CORS (ONPE no envía Access-Control-*).
// Solución: un Cloudflare Worker (ver /worker) que corre con IP peruana y añade
// CORS. Si está configurado vía NEXT_PUBLIC_ONPE_PROXY, el cliente le pega a él.
//
// Orden de intento:
//   1) Worker (si NEXT_PUBLIC_ONPE_PROXY está definido) → devuelve envelope {data}
//   2) Nuestro proxy /api (sirve en local y en Perú) → devuelve data desempaquetada
//   3) ONPE directo (solo funciona si ONPE permitiera CORS) → envelope {data}
import type { OnpeEnvelope } from "./types";

export const ONPE_PUBLIC_BASE =
  "https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend";

/** Base del Worker CORS, p.ej. https://onpe-proxy.x.workers.dev/presentacion-backend */
const WORKER_BASE = process.env.NEXT_PUBLIC_ONPE_PROXY?.replace(/\/$/, "");

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    if (ct.includes("application/json")) {
      try {
        const body = await res.json();
        if (body?.error) msg = body.error;
      } catch {
        /* ignore */
      }
    }
    throw new Error(msg);
  }
  if (!ct.includes("application/json")) {
    throw new Error("ONPE devolvió HTML en lugar de JSON.");
  }
  return res.json() as Promise<T>;
}

async function fromEnvelope<T>(url: string): Promise<T> {
  const env = await getJSON<OnpeEnvelope<T>>(url);
  if (!env.success) throw new Error(env.message || "ONPE success=false");
  return env.data;
}

/**
 * @param proxyUrl  ruta de nuestro proxy Next (/api/onpe/...) → devuelve `data`
 * @param directPath ruta ONPE (/proceso/...) usada contra el Worker o ONPE directo
 */
export async function proxyThenDirect<T>(
  proxyUrl: string,
  directPath: string,
): Promise<T> {
  // 1) Worker CORS (la vía que funciona en producción)
  if (WORKER_BASE) {
    try {
      return await fromEnvelope<T>(`${WORKER_BASE}${directPath}`);
    } catch {
      /* cae a los siguientes intentos */
    }
  }

  // 2) Nuestro proxy /api (local / Perú)
  try {
    return await getJSON<T>(proxyUrl);
  } catch {
    // 3) ONPE directo (último recurso)
    return fromEnvelope<T>(`${ONPE_PUBLIC_BASE}${directPath}`);
  }
}

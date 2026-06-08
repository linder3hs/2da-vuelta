import type { OnpeEnvelope } from "./types";

export const ONPE_BASE =
  "https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend";

// ONPE no geo-bloquea: su WAF sirve el SPA (HTML) salvo que la petición parezca
// el XHR legítimo del propio Angular. La clave es `Sec-Fetch-Site: same-origin`
// (+ Referer al mismo origen). Con esto el fetch server-side funciona desde
// cualquier IP (incluido Vercel) — no hace falta proxy en Perú.
const BROWSER_HEADERS: Record<string, string> = {
  Accept: "*/*",
  "Accept-Language": "es-PE,es;q=0.9",
  "Content-Type": "application/json",
  Referer: "https://resultadosegundavuelta.onpe.gob.pe/main/resumen",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

export class OnpeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "OnpeError";
  }
}

/**
 * Fetch server-side hacia ONPE. Resuelve CORS (el navegador no puede llamar
 * ONPE cross-origin) y reenvía headers de navegador.
 *
 * ONPE devuelve el SPA (HTML) como fallback cuando la API no está disponible
 * o el origen está geo-bloqueado; detectamos eso y lanzamos OnpeError 502.
 */
export async function fetchOnpe<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ONPE_BASE}${path}`, {
      headers: BROWSER_HEADERS,
      cache: "no-store",
    });
  } catch (e) {
    throw new OnpeError(
      `No se pudo conectar con ONPE: ${(e as Error).message}`,
      502,
    );
  }

  if (!res.ok) {
    throw new OnpeError(`ONPE respondió ${res.status}`, res.status);
  }

  const ct = res.headers.get("content-type") ?? "";
  const body = await res.text();

  if (!ct.includes("application/json") || body.trimStart().startsWith("<")) {
    // Fallback SPA (HTML) => API no disponible / geo-bloqueada.
    throw new OnpeError(
      "ONPE devolvió HTML en lugar de JSON (API no disponible o geo-bloqueada).",
      502,
    );
  }

  let json: OnpeEnvelope<T>;
  try {
    json = JSON.parse(body) as OnpeEnvelope<T>;
  } catch {
    throw new OnpeError("Respuesta de ONPE no es JSON válido.", 502);
  }

  if (!json.success) {
    throw new OnpeError(json.message || "ONPE reportó success=false", 502);
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Cache server-side compartido + dedupe de peticiones + último-valor-bueno.
//
// - TTL: todas las peticiones de clientes a la misma ruta comparten una sola
//   llamada a ONPE durante `ttlMs` (no martillamos ONPE ni nos arriesgamos a
//   que nos bloqueen aunque haya muchos usuarios).
// - Dedupe: si llega otra petición mientras una está en vuelo, espera la misma.
// - Stale-on-error: si ONPE falla pero ya tenemos un valor bueno, lo servimos
//   marcándolo como `stale` en vez de mostrar error (clave para Vercel/geo).
//
// La memoria de módulo persiste entre peticiones en la misma instancia (Fluid
// Compute reutiliza instancias), por lo que el cache funciona en producción.
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  ts: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export interface CachedResult<T> {
  data: T;
  /** true si se devolvió un valor antiguo porque ONPE falló */
  stale: boolean;
  /** epoch ms del fetch exitoso que generó este dato */
  fetchedAt: number;
}

export async function fetchOnpeCached<T>(
  path: string,
  ttlMs = 15_000,
): Promise<CachedResult<T>> {
  const hit = cache.get(path) as CacheEntry<T> | undefined;
  if (hit && Date.now() - hit.ts < ttlMs) {
    return { data: hit.data, stale: false, fetchedAt: hit.ts };
  }

  let p = inflight.get(path) as Promise<T> | undefined;
  if (!p) {
    p = fetchOnpe<T>(path)
      .then((data) => {
        cache.set(path, { data, ts: Date.now() });
        return data;
      })
      .finally(() => inflight.delete(path));
    inflight.set(path, p);
  }

  try {
    const data = await p;
    const fresh = cache.get(path) as CacheEntry<T> | undefined;
    return { data, stale: false, fetchedAt: fresh?.ts ?? Date.now() };
  } catch (e) {
    if (hit) {
      // ONPE falló pero tenemos último-valor-bueno: servir stale.
      return { data: hit.data, stale: true, fetchedAt: hit.ts };
    }
    throw e;
  }
}

import type { OnpeEnvelope } from "./types";

export const ONPE_BASE =
  "https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend";

const BROWSER_HEADERS: Record<string, string> = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "es-PE,es;q=0.9",
  Referer: "https://resultadosegundavuelta.onpe.gob.pe/main/resumen",
  Origin: "https://resultadosegundavuelta.onpe.gob.pe",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
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

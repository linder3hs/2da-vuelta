// Cloudflare Worker: proxy CORS hacia la API de ONPE.
//
// Por qué: ONPE geo-restringe la API a IPs de Perú y NO envía cabeceras CORS.
// Vercel (servidor) no alcanza la API (geo). El navegador del visitante en Perú
// SÍ la alcanza, pero CORS bloquea leer la respuesta. Este Worker corre en la
// red de Cloudflare (PoP de Lima para visitantes en Perú → IP peruana, pasa el
// geo) y añade las cabeceras CORS que faltan.
//
// Deploy:  cd worker && npx wrangler deploy
// Luego en Vercel define la env:
//   NEXT_PUBLIC_ONPE_PROXY = https://<tu-worker>.workers.dev/presentacion-backend

const ONPE_ORIGIN = "https://resultadosegundavuelta.onpe.gob.pe";
const ALLOWED_PREFIX = "/presentacion-backend/";

const UPSTREAM_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "es-PE,es;q=0.9",
  Referer: `${ONPE_ORIGIN}/main/resumen`,
  Origin: ONPE_ORIGIN,
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

function withCors(res) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  h.set("Access-Control-Allow-Headers", "*");
  h.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers: h });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith(ALLOWED_PREFIX)) {
      return withCors(
        new Response(JSON.stringify({ error: "Ruta no permitida" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      );
    }

    const target = ONPE_ORIGIN + url.pathname + url.search;
    let upstream;
    try {
      upstream = await fetch(target, {
        headers: UPSTREAM_HEADERS,
        // cache compartido en Cloudflare: 1 llamada a ONPE cada 15s para todos
        cf: { cacheTtl: 15, cacheEverything: true },
      });
    } catch (e) {
      return withCors(
        new Response(
          JSON.stringify({ error: `No se pudo conectar con ONPE: ${e}` }),
          { status: 502, headers: { "content-type": "application/json" } },
        ),
      );
    }

    const body = await upstream.text();
    const ct = upstream.headers.get("content-type") ?? "";

    // Si ONPE devuelve su SPA (HTML) => geo-bloqueo también para este PoP.
    if (!ct.includes("application/json") || body.trimStart().startsWith("<")) {
      return withCors(
        new Response(
          JSON.stringify({
            error:
              "ONPE devolvió HTML (el PoP de Cloudflare también está geo-bloqueado).",
          }),
          { status: 502, headers: { "content-type": "application/json" } },
        ),
      );
    }

    return withCors(
      new Response(body, {
        status: upstream.status,
        headers: { "content-type": "application/json" },
      }),
    );
  },
};

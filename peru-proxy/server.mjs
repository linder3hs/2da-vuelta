// Proxy CORS hacia ONPE, para correr en una máquina con IP RESIDENCIAL peruana.
//
// ONPE bloquea IPs de datacenter (Vercel, Cloudflare, AWS...) y solo deja pasar
// IPs residenciales de Perú. Por eso ni Vercel ni un Cloudflare Worker alcanzan
// la API. Este proxy corre en TU computadora (en Perú), llega a ONPE y añade las
// cabeceras CORS que faltan. Luego se expone con un túnel (ver README).
//
// Uso:  node peru-proxy/server.mjs           (escucha en :8787)
//       PORT=9000 node peru-proxy/server.mjs (puerto custom)
//
// Requiere Node 18+ (usa fetch global). Sin dependencias.

import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
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

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Cache-Control": "no-store",
};

function sendJson(res, status, obj) {
  res.writeHead(status, { ...CORS, "content-type": "application/json" });
  res.end(typeof obj === "string" ? obj : JSON.stringify(obj));
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/" || url.pathname === "/health") {
    return sendJson(res, 200, { ok: true, proxy: "onpe-peru", port: PORT });
  }

  if (!url.pathname.startsWith(ALLOWED_PREFIX)) {
    return sendJson(res, 404, { error: "Ruta no permitida" });
  }

  const target = ONPE_ORIGIN + url.pathname + url.search;
  let upstream;
  try {
    upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
  } catch (e) {
    return sendJson(res, 502, { error: `No se pudo conectar con ONPE: ${e}` });
  }

  const body = await upstream.text();
  const ct = upstream.headers.get("content-type") ?? "";
  if (!ct.includes("application/json") || body.trimStart().startsWith("<")) {
    return sendJson(res, 502, {
      error: "ONPE devolvió HTML (¿esta máquina no tiene IP peruana?).",
    });
  }

  return sendJson(res, upstream.status, body);
});

server.listen(PORT, () => {
  console.log(`[onpe-peru] proxy escuchando en http://localhost:${PORT}`);
  console.log(
    `[onpe-peru] prueba: http://localhost:${PORT}/presentacion-backend/proceso/proceso-electoral-activo`,
  );
});

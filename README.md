# Resultados en Vivo · Segunda Vuelta 2026 🇵🇪

Dashboard en tiempo real de la **Segunda Elección Presidencial 2026** del Perú.
Datos oficiales de **ONPE**, refresco automático cada **30 s**. UI con
glassmorphism, dark mode, gradientes y animaciones (Framer Motion).

## Stack

Next.js 15 (App Router) · React 19 · Tailwind v4 · SWR · Framer Motion.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

### Modo mock (sin conexión)

Para desarrollar sin red, sirve datos de muestra reales:

```bash
ONPE_MOCK=1 npm run dev
```

## Arquitectura

```
app/api/onpe/{proceso,totales,participantes}/route.ts  # proxy server-side a ONPE
hooks/useElection.ts                                   # SWR, refreshInterval 30s
lib/{onpe,types,format,parties,mock}.ts                # fetcher, tipos, helpers
components/*                                            # UI (glass, head-to-head, KPIs)
```

- **Proxy server-side**: el navegador no puede llamar a ONPE cross-origin (su CSP
  usa `connect-src 'self'`). Los route handlers hacen el fetch y devuelven JSON.
- **WAF de ONPE**: la API sirve el SPA (HTML) salvo que la petición lleve
  `Sec-Fetch-Site: same-origin` + `Referer` al mismo origen. El fetcher
  ([lib/onpe.ts](lib/onpe.ts)) los incluye, así funciona desde cualquier IP
  (incluido Vercel) — **no** hay geo-bloqueo.
- **`idEleccion`** se deriva de `proceso.idEleccionPrincipal` (no hardcodeado).
- Cache server-side compartido + último-valor-bueno ante fallo (`fetchOnpeCached`).

## Deploy en Vercel

Funciona directo: `git push` → deploy. No requiere configuración especial de
región ni proxy. (`ONPE_MOCK=1` queda disponible como fallback opcional.)

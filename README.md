# Resultados en Vivo · Segunda Vuelta 2026 🇵🇪

Dashboard en tiempo real de la **Segunda Elección Presidencial 2026** del Perú.
Datos oficiales de **ONPE**, refresco automático cada **30 s**. UI con
glassmorphism, dark mode, gradientes y animaciones (Framer Motion).

## Stack

Next.js 15 (App Router) · React 19 · Tailwind v4 · SWR · Framer Motion.

## Correr en local

```bash
npm install
npm run dev        # datos en vivo desde ONPE (requiere red/IP de Perú)
```

Abre http://localhost:3000

### Modo mock (sin conexión / fuera de Perú)

La API de ONPE está **geo-restringida a Perú** y bloqueada por CORS. Si estás
fuera de Perú o sin red, usa datos de muestra reales:

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

- **Proxy server-side**: el navegador no puede llamar a ONPE (CORS `connect-src 'self'`).
  Nuestros route handlers hacen el fetch con headers de navegador y devuelven JSON.
- **`idEleccion`** se deriva de `proceso.idEleccionPrincipal` (no hardcodeado).
- Si ONPE devuelve su SPA (HTML) en vez de JSON → 502 con mensaje claro; la UI
  muestra banner de reintento (o sirve mock si `ONPE_MOCK=1`).

## Deploy en Vercel

Las funciones de Vercel pueden estar **geo-bloqueadas por ONPE**. Mitigaciones:

1. Fijar la región de funciones a la más cercana a Perú. Crea `vercel.json`:
   ```json
   { "functions": { "app/api/onpe/**": { "maxDuration": 15 } }, "regions": ["gru1"] }
   ```
   (`gru1` = São Paulo; probar también `iad1`. Si ONPE bloquea todas, usar mock
   o un relay desde IP peruana.)
2. Como fallback de preview/producción degradada: setear `ONPE_MOCK=1` en las
   variables de entorno de Vercel.

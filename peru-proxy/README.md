# Proxy ONPE (IP peruana) + túnel

ONPE solo acepta IPs **residenciales peruanas**. Vercel, Cloudflare Workers y
cualquier datacenter están bloqueados. Por eso el proxy debe correr en una
máquina tuya en Perú (tu compu) y exponerse con un túnel público.

## 1. Levanta el proxy (en tu máquina en Perú)

```bash
node peru-proxy/server.mjs
```

Verifica en tu navegador local:
`http://localhost:8787/presentacion-backend/proceso/proceso-electoral-activo`
→ debe devolver JSON `{"success":true,...}`.

## 2. Expón con un túnel (Cloudflare Tunnel rápido, sin config)

En otra terminal:

```bash
# instala cloudflared si no lo tienes:
#   macOS:  brew install cloudflared
npx --yes cloudflared tunnel --url http://localhost:8787
```

Copia la URL que imprime, tipo:
`https://algo-aleatorio.trycloudflare.com`

Pruébala:
`https://algo-aleatorio.trycloudflare.com/presentacion-backend/proceso/proceso-electoral-activo`
→ JSON.

> Nota: la URL `trycloudflare.com` es **efímera** (cambia cada vez que reinicias
> el túnel). Para una URL estable usa un *named tunnel* de Cloudflare o un VPS.

## 3. Conecta la app (Vercel)

En Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_ONPE_PROXY = https://algo-aleatorio.trycloudflare.com/presentacion-backend
```

Redeploy. El cliente le pegará al túnel → tu máquina (IP Perú) → ONPE, con CORS.

## Importante

- El dashboard solo tendrá datos mientras tu máquina + el túnel estén encendidos.
- Para algo 24/7 (noche electoral), corre esto en una máquina peruana que quede
  prendida, o en un VPS con IP de Perú.
- El proxy ya cachea a nivel de SWR/cliente; ONPE recibe ~1 llamada cada 15–30s.

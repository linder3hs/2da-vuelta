import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Cuerpo / UI: grotesca limpia y neutra.
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-editorial",
  display: "swap",
});

// Titulares y cifras: serif editorial con carácter (alto contraste).
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resultados en Vivo · Segunda Vuelta 2026",
  description:
    "Resultados en tiempo real de la Segunda Elección Presidencial 2026 del Perú (fuente: ONPE).",
};

export const viewport: Viewport = {
  themeColor: "#f4f5f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable}`}
    >
      <head>
        <script
          // Aplica el tema guardado antes del primer pintado (default: dark).
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}",
          }}
        />
      </head>
      <body>
        <div className="app-backdrop" aria-hidden />
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token": "03a5f4e877444d7eab3b3d1a9b406ee3"}'
        />
      </body>
    </html>
  );
}

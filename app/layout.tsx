import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Cuerpo: sans editorial, limpio y legible.
const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-editorial",
  display: "swap",
});

// Titulares: serif de prensa (alto contraste).
const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-serif-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resultados en Vivo · Segunda Vuelta 2026",
  description:
    "Resultados en tiempo real de la Segunda Elección Presidencial 2026 del Perú (fuente: ONPE).",
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
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

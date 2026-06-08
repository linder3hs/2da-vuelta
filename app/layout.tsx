import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
    <html lang="es" className={poppins.variable}>
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

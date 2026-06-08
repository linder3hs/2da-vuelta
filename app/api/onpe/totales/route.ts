import { NextResponse } from "next/server";
import { fetchOnpe, OnpeError } from "@/lib/onpe";
import { MOCK_ENABLED, mockTotales } from "@/lib/mock";
import type { Totales } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idEleccion = searchParams.get("idEleccion") ?? "10";
  try {
    const data = await fetchOnpe<Totales>(
      `/resumen-general/totales?idEleccion=${encodeURIComponent(idEleccion)}&tipoFiltro=eleccion`,
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    if (MOCK_ENABLED) {
      return NextResponse.json(mockTotales, {
        headers: { "Cache-Control": "no-store", "X-Onpe-Mock": "1" },
      });
    }
    const status = e instanceof OnpeError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}

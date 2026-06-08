import { NextResponse } from "next/server";
import { fetchOnpe, OnpeError } from "@/lib/onpe";
import { MOCK_ENABLED, mockProceso } from "@/lib/mock";
import type { Proceso } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await fetchOnpe<Proceso>("/proceso/proceso-electoral-activo");
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    if (MOCK_ENABLED) {
      return NextResponse.json(mockProceso, {
        headers: { "Cache-Control": "no-store", "X-Onpe-Mock": "1" },
      });
    }
    const status = e instanceof OnpeError ? e.status : 500;
    return NextResponse.json({ error: (e as Error).message }, { status });
  }
}

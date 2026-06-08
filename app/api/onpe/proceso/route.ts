import { NextResponse } from "next/server";
import { fetchOnpeCached, OnpeError } from "@/lib/onpe";
import { MOCK_ENABLED, mockProceso } from "@/lib/mock";
import type { Proceso } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// proceso cambia poco → TTL más largo
const TTL = 60_000;

export async function GET() {
  try {
    const { data, stale, fetchedAt } = await fetchOnpeCached<Proceso>(
      "/proceso/proceso-electoral-activo",
      TTL,
    );
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
        "X-Onpe-Stale": stale ? "1" : "0",
        "X-Onpe-Fetched-At": String(fetchedAt),
      },
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

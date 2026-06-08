"use client";

import useSWR from "swr";
import type { Proceso, Totales, Participante } from "@/lib/types";

export const REFRESH_MS = 30_000;

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

const swrOpts = {
  refreshInterval: REFRESH_MS,
  revalidateOnFocus: true,
  keepPreviousData: true,
  dedupingInterval: 5_000,
};

export interface ElectionState {
  proceso?: Proceso;
  totales?: Totales;
  participantes?: Participante[];
  error?: Error;
  isLoading: boolean;
  /** ms epoch del último fetch exitoso del cliente */
  lastFetch?: number;
  refresh: () => void;
}

export function useElection(): ElectionState {
  const proc = useSWR<Proceso>("/api/onpe/proceso", fetcher, swrOpts);

  const idEleccion = proc.data?.idEleccionPrincipal;
  const key = idEleccion ? `idEleccion=${idEleccion}` : null;

  const tot = useSWR<Totales>(
    key ? `/api/onpe/totales?${key}` : null,
    fetcher,
    swrOpts,
  );
  const part = useSWR<Participante[]>(
    key ? `/api/onpe/participantes?${key}` : null,
    fetcher,
    swrOpts,
  );

  const refresh = () => {
    proc.mutate();
    tot.mutate();
    part.mutate();
  };

  const error = proc.error || tot.error || part.error;
  const isLoading =
    (proc.isLoading || tot.isLoading || part.isLoading) &&
    !(proc.data && tot.data && part.data);

  // ordena participantes por % válidos desc (ganador primero)
  const participantes = part.data
    ? [...part.data].sort(
        (a, b) => b.porcentajeVotosValidos - a.porcentajeVotosValidos,
      )
    : undefined;

  return {
    proceso: proc.data,
    totales: tot.data,
    participantes,
    error: error as Error | undefined,
    isLoading,
    lastFetch: tot.data ? Date.now() : undefined,
    refresh,
  };
}

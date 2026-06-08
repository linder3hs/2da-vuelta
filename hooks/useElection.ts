"use client";

import useSWR from "swr";
import type { Proceso, Totales, Participante } from "@/lib/types";
import { proxyThenDirect } from "@/lib/onpe-client";

export const REFRESH_MS = 30_000;

const swrOpts = {
  refreshInterval: REFRESH_MS,
  revalidateOnFocus: true,
  keepPreviousData: true,
  dedupingInterval: 5_000,
  // Evita el flood de reintentos en consola cuando la fuente falla (geo/CORS).
  // El refreshInterval seguirá reintentando cada 30s de forma controlada.
  errorRetryCount: 2,
  errorRetryInterval: 8_000,
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
  const proc = useSWR<Proceso>(
    "/api/onpe/proceso",
    () =>
      proxyThenDirect<Proceso>(
        "/api/onpe/proceso",
        "/proceso/proceso-electoral-activo",
      ),
    swrOpts,
  );

  const idEleccion = proc.data?.idEleccionPrincipal;
  const key = idEleccion ? `idEleccion=${idEleccion}` : null;

  const tot = useSWR<Totales>(
    key ? `/api/onpe/totales?${key}` : null,
    () =>
      proxyThenDirect<Totales>(
        `/api/onpe/totales?${key}`,
        `/resumen-general/totales?${key}&tipoFiltro=eleccion`,
      ),
    swrOpts,
  );
  const part = useSWR<Participante[]>(
    key ? `/api/onpe/participantes?${key}` : null,
    () =>
      proxyThenDirect<Participante[]>(
        `/api/onpe/participantes?${key}`,
        `/resumen-general/participantes?${key}&tipoFiltro=eleccion`,
      ),
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

// Muestras reales capturadas de la API de ONPE (07/06/2026).
// Se usan solo cuando ONPE_MOCK=1 — útil para desarrollo/preview cuando la API
// está geo-restringida (p. ej. fuera de Perú o en funciones de Vercel).
import type { Proceso, Totales, Participante } from "./types";

export const MOCK_ENABLED = process.env.ONPE_MOCK === "1";

export const mockProceso: Proceso = {
  id: 3,
  nombre: "SEGUNDA ELECCION PRESIDENCIAL 2026",
  acronimo: "SEP2026",
  fechaProceso: 1780808400000,
  idEleccionPrincipal: 10,
  tipoProcesoElectoral: "bicameralidad",
  activoFechaProceso: true,
};

export const mockTotales: Totales = {
  actasContabilizadas: 0.264,
  contabilizadas: 245,
  totalActas: 92766,
  participacionCiudadana: 0.197,
  actasEnviadasJee: 0.002,
  enviadasJee: 2,
  actasPendientesJee: 99.734,
  pendientesJee: 92519,
  fechaActualizacion: 1780875720263,
  idUbigeoDepartamento: null,
  idUbigeoProvincia: null,
  idUbigeoDistrito: null,
  idUbigeoDistritoElectoral: null,
  totalVotosEmitidos: 53928,
  totalVotosValidos: 50293,
  porcentajeVotosEmitidos: 100,
  porcentajeVotosValidos: 100,
};

export const mockParticipantes: Participante[] = [
  {
    nombreAgrupacionPolitica: "JUNTOS POR EL PERÚ",
    codigoAgrupacionPolitica: 10,
    nombreCandidato: "ROBERTO HELBERT SANCHEZ PALOMINO",
    dniCandidato: "16002918",
    totalVotosValidos: 22923,
    porcentajeVotosValidos: 45.579,
    porcentajeVotosEmitidos: 42.507,
  },
  {
    nombreAgrupacionPolitica: "FUERZA POPULAR",
    codigoAgrupacionPolitica: 8,
    nombreCandidato: "KEIKO SOFIA FUJIMORI HIGUCHI",
    dniCandidato: "10001088",
    totalVotosValidos: 27370,
    porcentajeVotosValidos: 54.421,
    porcentajeVotosEmitidos: 50.753,
  },
];

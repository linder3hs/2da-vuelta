// Tipos derivados de las respuestas reales de la API de ONPE.
// Todas las respuestas tienen forma { success, message, data }.

export interface OnpeEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** /proceso/proceso-electoral-activo */
export interface Proceso {
  id: number;
  nombre: string;
  acronimo: string;
  fechaProceso: number; // epoch ms
  idEleccionPrincipal: number;
  tipoProcesoElectoral: string;
  activoFechaProceso: boolean;
}

/** /proceso/{id}/elecciones */
export interface EleccionMenu {
  id: number;
  nombre: string;
  padre: number;
  hijos: boolean;
  icono: string;
  orden: number;
  idEleccion: number;
  url: string;
  esPrincipal: boolean;
  descripcion: string;
}

/** /resumen-general/totales */
export interface Totales {
  actasContabilizadas: number; // %
  contabilizadas: number;
  totalActas: number;
  participacionCiudadana: number; // %
  actasEnviadasJee: number; // %
  enviadasJee: number;
  actasPendientesJee: number; // %
  pendientesJee: number;
  fechaActualizacion: number; // epoch ms
  idUbigeoDepartamento: string | null;
  idUbigeoProvincia: string | null;
  idUbigeoDistrito: string | null;
  idUbigeoDistritoElectoral: string | null;
  totalVotosEmitidos: number;
  totalVotosValidos: number;
  porcentajeVotosEmitidos: number;
  porcentajeVotosValidos: number;
}

/** /resumen-general/participantes (array) */
export interface Participante {
  nombreAgrupacionPolitica: string;
  codigoAgrupacionPolitica: number;
  nombreCandidato: string;
  dniCandidato: string;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
  porcentajeVotosEmitidos: number;
}

/** Forma agregada que consume el dashboard. */
export interface ElectionSnapshot {
  proceso: Proceso;
  totales: Totales;
  participantes: Participante[];
}

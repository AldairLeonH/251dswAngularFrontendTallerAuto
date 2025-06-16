export interface OstTecnicoResponse {
  idOst: number;
  idTecnico: number;
  estado: number;
  fechaAsignacion: string;
  fechaFinalizacion: string | null;
  observaciones: string;
}
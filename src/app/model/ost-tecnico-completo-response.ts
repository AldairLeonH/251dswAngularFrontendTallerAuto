import { IOstResponse } from "./ost-response";

export interface OstTecnicoCompletoDTO {
  ost: IOstResponse; // Reutiliza tu interfaz actual de OST
  idOstTecnico: number;
  estadoAsignacion: string;
  fechaAsignacion: string;
  fechaFinalizacion: string;
  observaciones: string;
}
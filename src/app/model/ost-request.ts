import { IPregunta } from "./pregunta";

export interface IOstRequest {
  idOst?: number;
  fecha: string;   // o Date
  fechaRevision: string; 
  hora: string;    // formato "HH:mm"
  idDireccion: number;

  idModelo: number;
  placa: string;
  anio: string;
  color: string;
  idPersona: number;

  idEstado: number;
  idAuto: number;
  idRecepcionista: number;
  idSupervisor: number;
  preguntas: number[]; 
}
export interface IOstRequest {
  id_ost?: number;
  fecha: string;   // o Date
  hora: string;    // formato "HH:mm"
  direccion: string;
  estado: number;
  idAuto: number;
  idUsuario: number;
  preguntas: number[]; 
}
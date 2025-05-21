import { IAuto } from './auto';
import { IPregunta } from './pregunta';

export interface IOstResponse {
  idOst: number;
  fecha: string;
  hora: string;
  direccion: string;
  idModelo: number;
  placa: string;
  anio: string;
  estado: number;
  auto: IAuto;
  usuario: number;
  preguntas: IPregunta[];
}
import { IAuto } from './auto';
import { IPregunta } from './pregunta';

export interface IOstResponse {
  id_ost: number;
  fecha: string;
  hora: string;
  direccion: string;
  estado: number;
  auto: IAuto;
  usuario: number;
  preguntas: IPregunta[];
}
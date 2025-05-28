import { IAuto } from './auto';
import { IPregunta } from './pregunta';

export interface IOstResponse {
  idOst: number;
  fecha: string;
  hora: string;
  direccion: string;
  estado: string;

  placa: string;
  modelo: string;
  marca: string;
  color: string;
  anio: number;

  idPersona: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nroDocumento: string;
  tipoDocumento: string;
  telefono: string;

  recepcionista: string;
}
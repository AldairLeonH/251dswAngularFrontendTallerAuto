import { IPersona } from './persona';

export interface IAuto {
  idAuto?: number;
  placa: string;
  modelo: number;
  persona: number;
  anio: number;
  color: string;
}
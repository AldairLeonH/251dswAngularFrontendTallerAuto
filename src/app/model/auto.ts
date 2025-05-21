import { IModelo } from './modelo';
import { IPersona } from './persona';

export interface IAuto {
  idAuto?: number;
  placa: string;
  modelo: IModelo;
  persona: IPersona;
  anio: number;
  color: string;
}
import { IRol } from './rol';
import { IPersona } from './persona';

export interface IUsuarioResponse {
  idUsuario: number;
  nombreUsuario: string;
  password: string;
  rol: IRol;
  persona: IPersona;
} 
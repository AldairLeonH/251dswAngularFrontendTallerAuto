import { Rol } from './rol';
import { Persona } from './persona';

export interface IUsuarioResponse {
  idUsuario: number;
  nombreUsuario: string;
  password: string;
  rol: Rol;
  persona: Persona;
} 
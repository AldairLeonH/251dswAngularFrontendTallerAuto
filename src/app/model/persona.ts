import { TipoDocumento } from './tipo-documento';

export interface Persona {
  idPersona: number;
  nroDocumento: string;
  tipoDocumento: TipoDocumento;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  direccion: string;
  sexo: string;
  telefono: string;
}
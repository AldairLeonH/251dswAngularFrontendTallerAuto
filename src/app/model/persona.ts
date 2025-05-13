import { ITipoDocumento } from './tipo-documento';

export interface IPersona {
  idPersona: number;
  nroDocumento: string;
  tipoDocumento: ITipoDocumento;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  direccion: string;
  sexo: string;
  telefono: string;
}
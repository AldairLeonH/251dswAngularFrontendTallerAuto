import { IAuto } from "./auto";
import { IDireccion } from "./direccion";
import { ITipoEstado } from "./tipo-estado";
import { IUsuario } from "./usuario";
export interface IOst {
  idOst: number;
  fecha: string;
  fechaRevision: string;
  hora: string;
  nivelGasolina: string;
  kilometraje: number;
  direccion: IDireccion;
  estado: ITipoEstado;
  auto: IAuto;
  recepcionista: IUsuario;
  supervisor: IUsuario;
  
}

import { ITipoSolucion } from "./tipo-solucion";

export interface IBitacora {
          idProblema: number;
          descripcionProblema: string;
          solucion: string;
          fechaRegistro: string;
          tipoSolucion: ITipoSolucion

}

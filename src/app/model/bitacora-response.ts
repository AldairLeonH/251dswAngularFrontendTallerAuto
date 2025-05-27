import { ITipoSolucion } from "./tipo-solucion";

export interface IBitacoraResponse {
    idProblema:number;
    descripcionProblema: string;
    solucion:string;
    tipoSolucion: ITipoSolucion;
    fechaRegistro: string;
}

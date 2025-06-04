import { IModelo } from "./modelo";
import { IPersona } from "./persona";

export interface IAutoResponse {
    idAuto?:number;
    placa:string;
    modelo:IModelo;
    anio:number;
    color:string;
    persona:IPersona;  
}

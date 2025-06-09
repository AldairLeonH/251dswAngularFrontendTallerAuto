import { IInventarioAutoRequest } from "./inventario-auto-request";

export interface InventarioRevisionDTO {
  idOst: number;
  kilometraje: number;
  nivelGasolina: string;
  inventario: IInventarioAutoRequest[];
}
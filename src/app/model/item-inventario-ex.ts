import { IItemInventario } from "./item-inventario";

export interface IItemInventarioExtendido extends IItemInventario {
  cantidad: number;
  estado: string;
  seleccionado: boolean;
}
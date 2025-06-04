import { IItemInventario } from "./item-inventario";

export interface IInventarioAutoResponse {
  idInventario: number;
  item: IItemInventario;
  cantidad: number;
  estado: string;
}
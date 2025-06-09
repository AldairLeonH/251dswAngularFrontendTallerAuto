import { IItemInventario } from "./item-inventario";
import { IItemInventarioExtendido } from "./item-inventario-ex";

export interface ICategoriaItem {
  idCategoria: number;
  nombre: string;
    items: IItemInventarioExtendido[];
}
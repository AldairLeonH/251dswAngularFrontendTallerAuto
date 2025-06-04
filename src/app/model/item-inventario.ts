import { ICategoriaItem } from "./categoria-item";

export interface IItemInventario {
  idItem: number;
  nombre: string;
  categoria: ICategoriaItem;
}
import { IMarca } from "./marca";

export interface IModelo {
  idModelo: number;
  nombre: string;
  marca: IMarca;
}
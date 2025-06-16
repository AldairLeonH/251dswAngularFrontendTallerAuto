import { IOst } from "./ost";

export interface ICotizacionResponse {
  id: number;
  fecha: string;
  total: number;
  ost: IOst;
}

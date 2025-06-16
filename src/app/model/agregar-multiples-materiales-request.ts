import { IMaterialCotizacionRequest } from "./material-cotizacion-request";

export interface IAgregarMultiplesMaterialesRequest {
          idCotizacion: number;
          materiales: IMaterialCotizacionRequest[];
}

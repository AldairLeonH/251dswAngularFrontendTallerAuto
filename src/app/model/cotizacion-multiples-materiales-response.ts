import { ICotizacionMaterialResponse } from "./cotizacion-material-response";

export interface ICotizacionMultiplesMaterialesResponse {
          idCotizacion: number;
          materialesAgregados: ICotizacionMaterialResponse[];
}

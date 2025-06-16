import { IServicioResponse } from "./servicio-response";

export interface ICotizacionMultiplesServiciosResponse {
          idCotizacion: number;
          serviciosAgregados: IServicioResponse[];
}

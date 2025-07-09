export interface CotizacionPendienteEncuesta {
  idRecibo: number;
  idCotizacion: number;
  fechaPago: string; // LocalDateTime del backend
  descripcion: string;
  monto: number;
  idCliente: number;
  nombreCliente: string;
  placaVehiculo: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  estadoCotizacion: string;
  fechaVencimiento: string; // LocalDateTime del backend
} 
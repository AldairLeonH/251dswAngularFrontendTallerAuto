import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ICotizacionResponse } from '@model/cotizacion-response';
import { ICotizacionServicioResponse } from '@model/cotizacion-servicio-response';
import { IMaterialConCantidadResponse } from '@model/material-con-cantidad-response';
import { CotizacionService } from '@service/cotizacion.service';
import { ToastService } from '@service/toast.service';
import { AlertaExpiracionService } from '@service/alerta-expiracion.service';
import jsPDF from 'jspdf';
import { PdfService } from 'src/app/services/pdf.service';
import { interval, Subscription, catchError, of } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-ver-cotizaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-cotizaciones.component.html',
  styleUrl: './ver-cotizaciones.component.css'
})
export class VerCotizacionesComponent implements OnInit, OnDestroy {
  cotizaciones: ICotizacionResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  servicios: ICotizacionServicioResponse[] = [];
  materiales: IMaterialConCantidadResponse[] = [];
  cotizacionSeleccionadaId: number | null = null;
  
  // Nuevas propiedades para gestión de estados
  cotizacionesConEstado: any[] = [];
  cotizacionesExpiradas: Set<number> = new Set();
  private timerSubscription?: Subscription;
  private isUpdatingStates = false; // Flag para evitar actualizaciones concurrentes
  
  constructor(
    private cotizacionService: CotizacionService,
    private pdfService: PdfService,
    private toastService: ToastService,
    private alertaExpiracionService: AlertaExpiracionService
  ) {}

  ngOnInit(): void {
    this.loadCotizaciones();
    this.alertaExpiracionService.solicitarPermisosNotificacion();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.alertaExpiracionService.detenerMonitoreo();
  }

  private startTimer(): void {
    // Actualizar estados cada 30 segundos
    this.timerSubscription = interval(30000).subscribe(() => {
      this.actualizarEstadosCotizaciones();
    });
  }

  loadCotizaciones(): void {
    this.loading = true;
    this.error = null;

    this.cotizacionService.getCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.actualizarEstadosCotizaciones();
        this.alertaExpiracionService.iniciarMonitoreo(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las cotizaciones. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error fetching cotizaciones:', err);
      }
    });
  }

  private actualizarEstadosCotizaciones(): void {
    // Evitar actualizaciones concurrentes
    if (this.isUpdatingStates) {
      return;
    }
    
    this.isUpdatingStates = true;
    this.cotizacionesConEstado = [];
    this.cotizacionesExpiradas.clear();
    
    // Procesar cotizaciones en lotes para evitar sobrecarga
    const batchSize = 3;
    const processBatch = (startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, this.cotizaciones.length);
      const batch = this.cotizaciones.slice(startIndex, endIndex);
      
      let completedInBatch = 0;
      
      batch.forEach(cotizacion => {
        this.cotizacionService.getEstadoCotizacion(cotizacion.id)
          .pipe(
            catchError(err => {
              console.error('Error obteniendo estado de cotización:', err);
              return of(null);
            })
          )
          .subscribe({
            next: (estado) => {
              this.cotizacionesConEstado.push({
                ...cotizacion,
                estado: estado,
                // Preservar el estado original de la cotización
                estadoOriginal: cotizacion.estado
              });
              
              if (estado && estado.tiempoExpiracion && estado.tiempoExpiracion.expirada) {
                this.cotizacionesExpiradas.add(cotizacion.id);
              }
              
              completedInBatch++;
              
              // Si completamos el lote actual, procesar el siguiente
              if (completedInBatch === batch.length) {
                if (endIndex < this.cotizaciones.length) {
                  // Procesar siguiente lote después de un pequeño delay
                  setTimeout(() => processBatch(endIndex), 500);
                } else {
                  // Todos los lotes completados
                  this.isUpdatingStates = false;
                }
              }
            },
            error: (err) => {
              console.error('Error obteniendo estado de cotización:', err);
              this.cotizacionesConEstado.push({
                ...cotizacion,
                estado: null
              });
              
              completedInBatch++;
              
              if (completedInBatch === batch.length) {
                if (endIndex < this.cotizaciones.length) {
                  setTimeout(() => processBatch(endIndex), 500);
                } else {
                  this.isUpdatingStates = false;
                }
              }
            }
          });
      });
    };
    
    // Iniciar procesamiento del primer lote
    if (this.cotizaciones.length > 0) {
      processBatch(0);
    } else {
      this.isUpdatingStates = false;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  verMaterialesYServicios(idCotizacion: number): void {
    this.cotizacionSeleccionadaId = idCotizacion;
    this.servicios = [];
    this.materiales = [];

    this.cotizacionService.getMaterialesPorCotizacion(idCotizacion).subscribe({
      next: (data) => this.materiales = data,
      error: (err) => console.error('Error cargando materiales:', err)
    });

    this.cotizacionService.getServiciosPorCotizacion(idCotizacion).subscribe({
      next: (data) => this.servicios = data,
      error: (err) => console.error('Error cargando servicios:', err)
    });

    const modalElement = document.getElementById('modalDetalle');
    if (modalElement) {
      new bootstrap.Modal(modalElement).show();
    }
  }

  // NUEVOS MÉTODOS - Gestión de Estados
  pagarCotizacion(idCotizacion: number): void {
    if (this.cotizacionesExpiradas.has(idCotizacion)) {
      this.toastService.show('Esta cotización ya está expirada. No se puede realizar la acción.', 'warning');
      return;
    }
    this.cotizacionService.pagarCotizacion(idCotizacion).subscribe({
      next: (response) => {
        this.toastService.show('Cotización marcada como pagada', 'success');
        this.loadCotizaciones(); // Recargar para actualizar estados
      },
      error: (err) => {
        this.toastService.show('Error al pagar la cotización', 'danger');
        console.error('Error pagando cotización:', err);
      }
    });
  }

  expirarCotizacion(idCotizacion: number): void {
    if (this.cotizacionesExpiradas.has(idCotizacion)) {
      this.toastService.show('Esta cotización ya está expirada. No se puede realizar la acción.', 'warning');
      return;
    }
    this.cotizacionService.expirarCotizacion(idCotizacion).subscribe({
      next: (response) => {
        this.toastService.show('Cotización marcada como expirada', 'success');
        this.loadCotizaciones();
      },
      error: (err) => {
        this.toastService.show('Error al expirar la cotización', 'danger');
        console.error('Error expirando cotización:', err);
      }
    });
  }

  cancelarCotizacion(idCotizacion: number): void {
    if (this.cotizacionesExpiradas.has(idCotizacion)) {
      this.toastService.show('Esta cotización ya está expirada. No se puede realizar la acción.', 'warning');
      return;
    }
    this.cotizacionService.cancelarCotizacion(idCotizacion).subscribe({
      next: (response) => {
        this.toastService.show('Cotización cancelada', 'success');
        this.loadCotizaciones();
      },
      error: (err) => {
        this.toastService.show('Error al cancelar la cotización', 'danger');
        console.error('Error cancelando cotización:', err);
      }
    });
  }

  extenderTiempoExpiracion(idCotizacion: number): void {
    if (this.cotizacionesExpiradas.has(idCotizacion)) {
      this.toastService.show('Esta cotización ya está expirada. No se puede realizar la acción.', 'warning');
      return;
    }
    this.cotizacionService.extenderTiempoExpiracion(idCotizacion).subscribe({
      next: (response) => {
        this.toastService.show('Tiempo de expiración extendido', 'success');
        this.loadCotizaciones();
      },
      error: (err) => {
        this.toastService.show('Error al extender el tiempo de expiración', 'danger');
        console.error('Error extendiendo tiempo:', err);
      }
    });
  }

  // Método para obtener el estado de una cotización específica
  getCotizacionConEstado(idCotizacion: number): any {
    return this.cotizacionesConEstado.find(c => c.id === idCotizacion);
  }

  // Método para formatear el tiempo restante
  formatTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Expirada';
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  }

  // Método para obtener la clase CSS según el estado
  getEstadoClass(cotizacion: any): string {
    if (!cotizacion.estado) return '';
    
    const estado = cotizacion.estado.tiempoExpiracion;
    if (estado?.expirada) return 'text-danger';
    if (estado?.proximaAExpirar) return 'text-warning';
    return 'text-success';
  }

  // NUEVO: Método para obtener el estado de la cotización
  getEstadoCotizacion(cotizacion: any): string {
    // Si hay información de estado dinámico (del endpoint /estado)
    if (cotizacion.estado && typeof cotizacion.estado === 'object') {
      // Verificar si la cotización está pagada según el estado dinámico
      if (cotizacion.estado.cotizacion?.estado === 'PAGADO') {
        return 'Pagada';
      }

      // Si hay información de tiempo de expiración
      if (cotizacion.estado.tiempoExpiracion) {
        if (cotizacion.estado.tiempoExpiracion.expirada) {
          return 'Expirada';
        }
        if (cotizacion.estado.tiempoExpiracion.proximaAExpirar) {
          return 'Por Expirar';
        }
      }
    }

    // Si no hay estado dinámico, usar el estado directo de la cotización
    if (cotizacion.estado && typeof cotizacion.estado === 'string') {
      switch (cotizacion.estado) {
        case 'PAGADO':
          return 'Pagada';
        case 'EXPIRADO':
          return 'Expirada';
        case 'PENDIENTE':
          return 'Pendiente';
        default:
          return 'Activa';
      }
    }

    // Si no hay estado, usar el estado de la orden de servicio como fallback
    return cotizacion.ost?.estado?.estado || 'Pendiente';
  }

  // NUEVO: Método para obtener la clase CSS del badge del estado
  getEstadoBadgeClass(cotizacion: any): string {
    const estado = this.getEstadoCotizacion(cotizacion);
    
    switch (estado) {
      case 'Pagada':
        return 'bg-success';
      case 'Expirada':
        return 'bg-danger';
      case 'Por Expirar':
        return 'bg-warning text-dark';
      case 'Activa':
        return 'bg-info text-dark';
      case 'Pendiente':
        return 'bg-warning text-dark';
      case 'Atendida':
        return 'bg-success';
      case 'Rechazado':
        return 'bg-danger';
      case 'En Proceso':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  }

  // Método para contar materiales con stock disponible
  getMaterialesConStockDisponible(): number {
    return this.materiales.filter(m => m.stock >= m.cantidad).length;
  }

  generarPDF(cotizacion: ICotizacionResponse): void {
    this.cotizacionService.getMaterialesPorCotizacion(cotizacion.id).subscribe({
      next: (materiales) => {
        this.cotizacionService.getServiciosPorCotizacion(cotizacion.id).subscribe({
          next: (servicios) => {
            this.pdfService.generateCotizacionPDF(cotizacion, servicios, materiales);
          },
          error: (err) => {
            console.error('Error al obtener servicios:', err);
            this.pdfService.generateCotizacionPDF(cotizacion, [], materiales);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener materiales:', err);
        this.cotizacionService.getServiciosPorCotizacion(cotizacion.id).subscribe({
          next: (servicios) => {
            this.pdfService.generateCotizacionPDF(cotizacion, servicios, []);
          },
          error: (err) => {
            console.error('Error al obtener servicios:', err);
            this.pdfService.generateCotizacionPDF(cotizacion, [], []);
          }
        });
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICotizacionResponse } from '@model/cotizacion-response';
import { CotizacionService } from '@service/cotizacion.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-gestion-estados-cotizacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-gear me-2"></i>
          Gestión de Estados - Cotización #{{ cotizacion?.id }}
        </h5>
      </div>
      <div class="card-body">
        <!-- Estado actual -->
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Estado actual:</strong>
            <span class="badge ms-2" 
                  [ngClass]="{
                    'bg-warning text-dark': cotizacion?.ost?.estado?.estado === 'Pendiente',
                    'bg-success': cotizacion?.ost?.estado?.estado === 'Atendida',
                    'bg-danger': cotizacion?.ost?.estado?.estado === 'Rechazado',
                    'bg-info text-dark': cotizacion?.ost?.estado?.estado === 'En Proceso'
                  }">
              {{ cotizacion?.ost?.estado?.estado }}
            </span>
          </div>
          <div class="col-md-6">
            <strong>Total:</strong>
            <span class="text-success fw-bold ms-2">S/ {{ cotizacion?.total | number:'1.2-2' }}</span>
          </div>
        </div>

        <!-- Tiempo de expiración -->
        <div *ngIf="estadoCotizacion?.tiempoExpiracion" class="alert mb-3" 
             [ngClass]="{
               'alert-danger': estadoCotizacion.tiempoExpiracion.expirada,
               'alert-warning': estadoCotizacion.tiempoExpiracion.proximaAExpirar && !estadoCotizacion.tiempoExpiracion.expirada,
               'alert-success': !estadoCotizacion.tiempoExpiracion.proximaAExpirar && !estadoCotizacion.tiempoExpiracion.expirada
             }">
          <div class="d-flex justify-content-between align-items-center">
            <span>
              <i class="bi bi-clock me-2"></i>
              <strong>Tiempo restante:</strong> {{ formatTiempoRestante(estadoCotizacion.tiempoExpiracion.minutosRestantes) }}
            </span>
            <small *ngIf="estadoCotizacion.tiempoExpiracion.fechaExpiracion">
              Expira: {{ formatDateTime(estadoCotizacion.tiempoExpiracion.fechaExpiracion) }}
            </small>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-success" 
                  (click)="pagarCotizacion()"
                  [disabled]="cotizacion?.ost?.estado?.estado === 'Atendida'"
                  title="Marcar como Pagada">
            <i class="bi bi-check-circle me-2"></i>
            Pagar
          </button>

          <button class="btn btn-warning" 
                  (click)="extenderTiempo()"
                  [disabled]="!estadoCotizacion?.tiempoExpiracion || estadoCotizacion.tiempoExpiracion.expirada"
                  title="Extender Tiempo de Expiración">
            <i class="bi bi-clock me-2"></i>
            Extender Tiempo
          </button>

          <button class="btn btn-info" 
                  (click)="expirarCotizacion()"
                  [disabled]="!estadoCotizacion?.tiempoExpiracion || estadoCotizacion.tiempoExpiracion.expirada"
                  title="Marcar como Expirada">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Marcar Expirada
          </button>

          <button class="btn btn-danger" 
                  (click)="cancelarCotizacion()"
                  [disabled]="cotizacion?.ost?.estado?.estado === 'Rechazado'"
                  title="Cancelar Cotización">
            <i class="bi bi-x-circle me-2"></i>
            Cancelar
          </button>

          <button class="btn btn-secondary" 
                  (click)="volverALista()"
                  title="Volver a la lista">
            <i class="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>

        <!-- Información adicional -->
        <div *ngIf="estadoCotizacion?.materiales" class="mt-3 p-3 bg-light rounded">
          <h6>Información de Materiales</h6>
          <div class="row">
            <div class="col-md-4">
              <strong>Total materiales:</strong> {{ estadoCotizacion.materiales.length }}
            </div>
                         <div class="col-md-4">
               <strong>Con stock disponible:</strong> 
               {{ getMaterialesConStockDisponible() }}
             </div>
             <div class="col-md-4">
               <strong>Stock insuficiente:</strong> 
               {{ getMaterialesConStockInsuficiente() }}
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
    
    .btn {
      border-radius: 0.375rem;
    }
    
    .badge {
      font-size: 0.875em;
    }
  `]
})
export class GestionEstadosCotizacionComponent implements OnInit {
  @Input() cotizacion?: ICotizacionResponse;
  @Output() estadoCambiado = new EventEmitter<void>();

  estadoCotizacion: any = null;
  loading = false;
  cotizacionId: number = 0;

  constructor(
    private cotizacionService: CotizacionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la cotización desde la ruta
    this.route.params.subscribe(params => {
      this.cotizacionId = +params['id'];
      if (this.cotizacionId) {
        this.cargarCotizacion();
      }
    });
  }

  cargarCotizacion(): void {
    // Cargar la cotización completa si no se proporciona como Input
    if (!this.cotizacion) {
      this.cotizacionService.getCotizaciones().subscribe({
        next: (cotizaciones) => {
          this.cotizacion = cotizaciones.find(c => c.id === this.cotizacionId);
          if (this.cotizacion) {
            this.cargarEstadoCotizacion();
          } else {
            this.toastService.show('Cotización no encontrada', 'danger');
            this.router.navigate(['/cotizaciones/ver-cotizaciones']);
          }
        },
        error: (err) => {
          this.toastService.show('Error al cargar la cotización', 'danger');
          this.router.navigate(['/cotizaciones/ver-cotizaciones']);
        }
      });
    } else {
      this.cargarEstadoCotizacion();
    }
  }

  cargarEstadoCotizacion(): void {
    if (!this.cotizacion) return;

    this.cotizacionService.getEstadoCotizacion(this.cotizacion.id).subscribe({
      next: (estado) => {
        this.estadoCotizacion = estado;
      },
      error: (err) => {
        console.error('Error cargando estado de cotización:', err);
        this.toastService.show('Error al cargar el estado de la cotización', 'danger');
      }
    });
  }

  volverALista(): void {
    this.router.navigate(['/cotizaciones/ver-cotizaciones']);
  }

  pagarCotizacion(): void {
    if (!this.cotizacion) return;

    this.loading = true;
    this.cotizacionService.pagarCotizacion(this.cotizacion.id).subscribe({
      next: (response) => {
        this.toastService.show('Cotización marcada como pagada', 'success');
        this.estadoCambiado.emit();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.show('Error al pagar la cotización', 'danger');
        console.error('Error pagando cotización:', err);
        this.loading = false;
      }
    });
  }

  extenderTiempo(): void {
    if (!this.cotizacion) return;

    this.loading = true;
    this.cotizacionService.extenderTiempoExpiracion(this.cotizacion.id).subscribe({
      next: (response) => {
        this.toastService.show('Tiempo de expiración extendido', 'success');
        this.cargarEstadoCotizacion();
        this.estadoCambiado.emit();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.show('Error al extender el tiempo de expiración', 'danger');
        console.error('Error extendiendo tiempo:', err);
        this.loading = false;
      }
    });
  }

  expirarCotizacion(): void {
    if (!this.cotizacion) return;

    this.loading = true;
    this.cotizacionService.expirarCotizacion(this.cotizacion.id).subscribe({
      next: (response) => {
        this.toastService.show('Cotización marcada como expirada', 'success');
        this.cargarEstadoCotizacion();
        this.estadoCambiado.emit();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.show('Error al expirar la cotización', 'danger');
        console.error('Error expirando cotización:', err);
        this.loading = false;
      }
    });
  }

  cancelarCotizacion(): void {
    if (!this.cotizacion) return;

    this.loading = true;
    this.cotizacionService.cancelarCotizacion(this.cotizacion.id).subscribe({
      next: (response) => {
        this.toastService.show('Cotización cancelada', 'success');
        this.estadoCambiado.emit();
        this.loading = false;
      },
      error: (err) => {
        this.toastService.show('Error al cancelar la cotización', 'danger');
        console.error('Error cancelando cotización:', err);
        this.loading = false;
      }
    });
  }

  formatTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Expirada';
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
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

  getMaterialesConStockDisponible(): number {
    if (!this.estadoCotizacion?.materiales) return 0;
    return this.estadoCotizacion.materiales.filter((m: any) => m.stock >= m.cantidad).length;
  }

  getMaterialesConStockInsuficiente(): number {
    if (!this.estadoCotizacion?.materiales) return 0;
    return this.estadoCotizacion.materiales.filter((m: any) => m.stock < m.cantidad).length;
  }
} 
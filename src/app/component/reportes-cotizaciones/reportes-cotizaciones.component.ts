import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CotizacionService } from '@service/cotizacion.service';
import { ICotizacionResponse } from '@model/cotizacion-response';

@Component({
  selector: 'app-reportes-cotizaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">
          <i class="bi bi-graph-up me-2"></i>
          Reportes de Cotizaciones
        </h2>
        <div class="btn-group">
          <button class="btn btn-outline-primary" (click)="exportarReporte()">
            <i class="bi bi-download me-2"></i>
            Exportar
          </button>
          <button class="btn btn-outline-secondary" (click)="imprimirReporte()">
            <i class="bi bi-printer me-2"></i>
            Imprimir
          </button>
        </div>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <div class="h2 text-primary mb-2">{{ estadisticas.total }}</div>
              <div class="text-muted">Total Cotizaciones</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <div class="h2 text-success mb-2">{{ estadisticas.pagadas }}</div>
              <div class="text-muted">Pagadas</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <div class="h2 text-warning mb-2">{{ estadisticas.pendientes }}</div>
              <div class="text-muted">Pendientes</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <div class="h2 text-danger mb-2">{{ estadisticas.expiradas }}</div>
              <div class="text-muted">Expiradas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Filtros</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <label class="form-label">Estado</label>
              <select class="form-select" [(ngModel)]="filtros.estado">
                <option value="">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Atendida">Atendida</option>
                <option value="Rechazado">Rechazado</option>
                <option value="En Proceso">En Proceso</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Desde</label>
              <input type="date" class="form-control" [(ngModel)]="filtros.fechaDesde">
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Hasta</label>
              <input type="date" class="form-control" [(ngModel)]="filtros.fechaHasta">
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-primary me-2" (click)="aplicarFiltros()">
                <i class="bi bi-funnel me-2"></i>
                Filtrar
              </button>
              <button class="btn btn-outline-secondary" (click)="limpiarFiltros()">
                <i class="bi bi-x-circle me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de resultados -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Resultados</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Vehículo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Tiempo Restante</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cot of cotizacionesFiltradas; let i = index">
                  <td>{{ i + 1 }}</td>
                  <td>{{ formatDate(cot.fecha) }}</td>
                  <td>
                    {{ cot.ost.auto.persona.apellidoPaterno }} 
                    {{ cot.ost.auto.persona.apellidoMaterno }}, 
                    {{ cot.ost.auto.persona.nombres }}
                  </td>
                  <td>
                    {{ cot.ost.auto.placa }} - 
                    {{ cot.ost.auto.modelo.marca.nombre }} {{ cot.ost.auto.modelo.nombre }}
                  </td>
                  <td class="fw-bold text-success">S/ {{ cot.total | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-warning text-dark': cot.ost.estado.estado === 'Pendiente',
                      'bg-success': cot.ost.estado.estado === 'Atendida',
                      'bg-danger': cot.ost.estado.estado === 'Rechazado',
                      'bg-info text-dark': cot.ost.estado.estado === 'En Proceso'
                    }">
                      {{ cot.ost.estado.estado }}
                    </span>
                  </td>
                  <td>
                    <span *ngIf="getTiempoRestante(cot)" [ngClass]="{
                      'text-danger': getTiempoRestante(cot)?.expirada,
                      'text-warning': getTiempoRestante(cot)?.proximaAExpirar && !getTiempoRestante(cot)?.expirada,
                      'text-success': !getTiempoRestante(cot)?.proximaAExpirar && !getTiempoRestante(cot)?.expirada
                    }">
                      {{ formatTiempoRestante(getTiempoRestante(cot)?.minutosRestantes) }}
                    </span>
                    <span *ngIf="!getTiempoRestante(cot)" class="text-muted">Sin expiración</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
    
    .table th {
      border-top: none;
      font-weight: 600;
    }
    
    .badge {
      font-size: 0.875em;
    }
  `]
})
export class ReportesCotizacionesComponent implements OnInit {
  cotizaciones: ICotizacionResponse[] = [];
  cotizacionesFiltradas: ICotizacionResponse[] = [];
  estadisticas = {
    total: 0,
    pagadas: 0,
    pendientes: 0,
    expiradas: 0
  };
  filtros = {
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    this.cargarCotizaciones();
  }

  cargarCotizaciones(): void {
    this.cotizacionService.getCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.cotizacionesFiltradas = data;
        this.calcularEstadisticas();
      },
      error: (err) => {
        console.error('Error cargando cotizaciones:', err);
      }
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.total = this.cotizaciones.length;
    this.estadisticas.pagadas = this.cotizaciones.filter(c => c.ost.estado.estado === 'Atendida').length;
    this.estadisticas.pendientes = this.cotizaciones.filter(c => c.ost.estado.estado === 'Pendiente').length;
    this.estadisticas.expiradas = this.cotizaciones.filter(c => {
      const tiempo = this.getTiempoRestante(c);
      return tiempo?.expirada;
    }).length;
  }

  aplicarFiltros(): void {
    this.cotizacionesFiltradas = this.cotizaciones.filter(cot => {
      // Filtro por estado
      if (this.filtros.estado && cot.ost.estado.estado !== this.filtros.estado) {
        return false;
      }

      // Filtro por fecha
      if (this.filtros.fechaDesde) {
        const fechaCotizacion = new Date(cot.fecha);
        const fechaDesde = new Date(this.filtros.fechaDesde);
        if (fechaCotizacion < fechaDesde) {
          return false;
        }
      }

      if (this.filtros.fechaHasta) {
        const fechaCotizacion = new Date(cot.fecha);
        const fechaHasta = new Date(this.filtros.fechaHasta);
        if (fechaCotizacion > fechaHasta) {
          return false;
        }
      }

      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    };
    this.cotizacionesFiltradas = this.cotizaciones;
  }

  getTiempoRestante(cotizacion: ICotizacionResponse): any {
    // En un caso real, esto vendría del estado de la cotización
    return null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTiempoRestante(minutos: number): string {
    if (minutos <= 0) return 'Expirada';
    if (minutos < 60) return `${minutos} min`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  }

  exportarReporte(): void {
    // Implementar exportación a Excel/PDF
    console.log('Exportando reporte...');
  }

  imprimirReporte(): void {
    // Implementar impresión
    window.print();
  }
} 
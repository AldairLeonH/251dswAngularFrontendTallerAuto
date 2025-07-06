import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navegacion-cotizaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="bi bi-file-earmark-text me-2"></i>
          Gestión de Cotizaciones
        </h6>
      </div>
      <div class="card-body p-0">
        <div class="list-group list-group-flush">
          <a class="list-group-item list-group-item-action d-flex align-items-center" 
             routerLink="/cotizaciones/ver-cotizaciones"
             routerLinkActive="active">
            <i class="bi bi-list-ul me-3"></i>
            <div>
              <div class="fw-semibold">Ver Cotizaciones</div>
              <small class="text-muted">Lista de todas las cotizaciones</small>
            </div>
          </a>
          
          <a class="list-group-item list-group-item-action d-flex align-items-center" 
             routerLink="/cotizaciones/nueva"
             routerLinkActive="active">
            <i class="bi bi-plus-circle me-3"></i>
            <div>
              <div class="fw-semibold">Nueva Cotización</div>
              <small class="text-muted">Crear una nueva cotización</small>
            </div>
          </a>
          
          <a class="list-group-item list-group-item-action d-flex align-items-center" 
             routerLink="/cotizaciones/reportes"
             routerLinkActive="active">
            <i class="bi bi-graph-up me-3"></i>
            <div>
              <div class="fw-semibold">Reportes</div>
              <small class="text-muted">Reportes y estadísticas</small>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="card mt-3">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="bi bi-speedometer2 me-2"></i>
          Estadísticas Rápidas
        </h6>
      </div>
      <div class="card-body">
        <div class="row text-center">
          <div class="col-6">
            <div class="border-end">
              <div class="h4 text-primary mb-1">{{ estadisticas?.pendientes || 0 }}</div>
              <small class="text-muted">Pendientes</small>
            </div>
          </div>
          <div class="col-6">
            <div class="h4 text-warning mb-1">{{ estadisticas?.proximasAExpirar || 0 }}</div>
            <small class="text-muted">Próximas a expirar</small>
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
    
    .list-group-item {
      border: none;
      border-bottom: 1px solid #dee2e6;
      transition: all 0.2s ease;
    }
    
    .list-group-item:last-child {
      border-bottom: none;
    }
    
    .list-group-item:hover {
      background-color: #f8f9fa;
    }
    
    .list-group-item.active {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .list-group-item.active small {
      color: rgba(255, 255, 255, 0.8) !important;
    }
    
    .bi {
      font-size: 1.1rem;
    }
  `]
})
export class NavegacionCotizacionesComponent implements OnInit {
  estadisticas: { pendientes?: number; proximasAExpirar?: number } = {};

  // En un caso real, estas estadísticas vendrían de un servicio
  ngOnInit(): void {
    // this.cotizacionService.getEstadisticas().subscribe(...)
    this.estadisticas = {
      pendientes: 5,
      proximasAExpirar: 2
    };
  }
} 
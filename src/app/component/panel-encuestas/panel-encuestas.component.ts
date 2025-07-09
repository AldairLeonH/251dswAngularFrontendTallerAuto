import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncuestaSatisfaccionService } from '../../service/encuesta-satisfaccion.service';
import { ToastService } from '../../service/toast.service';
import { EncuestaSatisfaccionResponse } from '../../model/encuesta-satisfaccion-response';

@Component({
  selector: 'app-panel-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-encuestas.component.html',
  styleUrls: ['./panel-encuestas.component.css']
})
export class PanelEncuestasComponent implements OnInit {
  encuestas: EncuestaSatisfaccionResponse[] = [];
  estadisticas: any = {};
  loading: boolean = false;
  loadingStats: boolean = false;

  constructor(
    private encuestaService: EncuestaSatisfaccionService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEncuestas();
    this.cargarEstadisticas();
  }

  cargarEncuestas(): void {
    this.loading = true;
    this.encuestaService.obtenerTodasLasEncuestas().subscribe({
      next: (encuestas) => {
        this.encuestas = encuestas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar encuestas:', error);
        this.toastService.show('Error al cargar las encuestas', 'danger');
        this.loading = false;
      }
    });
  }

  cargarEstadisticas(): void {
    this.loadingStats = true;
    this.encuestaService.obtenerEstadisticasSatisfaccion().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.toastService.show('Error al cargar las estadísticas', 'danger');
        this.loadingStats = false;
      }
    });
  }

  obtenerNivelSatisfaccion(promedio: number): string {
    if (promedio >= 4.5) return 'EXCELENTE';
    if (promedio >= 4.0) return 'MUY BUENO';
    if (promedio >= 3.5) return 'BUENO';
    if (promedio >= 3.0) return 'REGULAR';
    return 'BAJO';
  }

  obtenerColorNivel(nivel: string): string {
    switch (nivel) {
      case 'EXCELENTE': return 'success';
      case 'MUY BUENO': return 'info';
      case 'BUENO': return 'primary';
      case 'REGULAR': return 'warning';
      case 'BAJO': return 'danger';
      default: return 'secondary';
    }
  }

  verDetalleEncuesta(encuesta: EncuestaSatisfaccionResponse): void {
    // Navegar a una página de detalle o mostrar modal
    this.router.navigate(['/detalle-encuesta', encuesta.idRecibo]);
  }

  exportarReporte(): void {
    this.toastService.show('Funcionalidad de exportación en desarrollo', 'info');
  }

  calcularPorcentajeSatisfaccion(): number {
    if (!this.estadisticas.puntaje1 && !this.estadisticas.puntaje2 && 
        !this.estadisticas.puntaje3 && !this.estadisticas.puntaje4 && 
        !this.estadisticas.puntaje5) {
      return 0;
    }

    const total = this.estadisticas.puntaje1 + this.estadisticas.puntaje2 + 
                  this.estadisticas.puntaje3 + this.estadisticas.puntaje4 + 
                  this.estadisticas.puntaje5;
    
    const satisfechos = this.estadisticas.puntaje4 + this.estadisticas.puntaje5;
    
    return Math.round((satisfechos / total) * 100);
  }

  obtenerTotalEncuestas(): number {
    return this.estadisticas.puntaje1 + this.estadisticas.puntaje2 + 
           this.estadisticas.puntaje3 + this.estadisticas.puntaje4 + 
           this.estadisticas.puntaje5;
  }

  refrescarDatos(): void {
    this.cargarEncuestas();
    this.cargarEstadisticas();
    this.toastService.show('Datos actualizados', 'success');
  }
} 
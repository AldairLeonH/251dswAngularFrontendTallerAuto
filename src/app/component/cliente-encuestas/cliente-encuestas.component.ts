import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncuestaSatisfaccionService } from '../../service/encuesta-satisfaccion.service';
import { ToastService } from '../../service/toast.service';
import { UsuarioService } from '../../service/usuario.service';
import { EncuestaSatisfaccionResponse } from '../../model/encuesta-satisfaccion-response';
import { CotizacionPendienteEncuesta } from '../../model/cotizacion-pendiente-encuesta';

// Extensión temporal para evitar errores de tipado
interface EncuestaSatisfaccionResponseExtendida extends EncuestaSatisfaccionResponse {
  estadoRecibo?: string;
  idCliente?: number;
}

@Component({
  selector: 'app-cliente-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-encuestas.component.html',
  styleUrls: ['./cliente-encuestas.component.css']
})
export class ClienteEncuestasComponent implements OnInit {
  encuestasCompletadas: EncuestaSatisfaccionResponseExtendida[] = [];
  encuestasPendientes: CotizacionPendienteEncuesta[] = []; // Aquí irían las cotizaciones pagadas sin encuesta
  loading: boolean = false;
  loadingPendientes: boolean = false;

  constructor(
    private encuestaService: EncuestaSatisfaccionService,
    private toastService: ToastService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEncuestasCompletadas();
    this.cargarEncuestasPendientes();
  }

  cargarEncuestasCompletadas(): void {
    this.loading = true;
    
    // Obtener el ID del usuario desde localStorage
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      this.toastService.show('No se pudo obtener la información del usuario', 'danger');
      this.loading = false;
      return;
    }

    // Obtener el idPersona del usuario autenticado
    this.usuarioService.getIdPersonaPorUsuario(parseInt(idUsuario)).subscribe({
      next: (idPersona) => {
        console.log('ID de persona para encuestas completadas:', idPersona);
        this.encuestaService.obtenerTodasLasEncuestas().subscribe({
          next: (encuestas) => {
            // Filtrar encuestas del cliente actual y solo las de recibos con estado 'ENCUESTA REALIZADA'
            this.encuestasCompletadas = (encuestas as EncuestaSatisfaccionResponseExtendida[])
              .filter(e => (!e.estadoRecibo || e.estadoRecibo === 'ENCUESTA REALIZADA'))
              .filter(e => e.idCliente === idPersona)
              .slice(0, 5); // Mostrar solo las últimas 5
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar encuestas completadas:', error);
            this.toastService.show('Error al cargar las encuestas completadas', 'danger');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener ID de persona para encuestas completadas:', error);
        this.toastService.show('Error al obtener la información del cliente', 'danger');
        this.loading = false;
      }
    });
  }

  cargarEncuestasPendientes(): void {
    this.loadingPendientes = true;
    
    // Obtener el ID del usuario desde localStorage
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      this.toastService.show('No se pudo obtener la información del usuario', 'danger');
      this.loadingPendientes = false;
      return;
    }

    // Obtener el idPersona del usuario autenticado
    this.usuarioService.getIdPersonaPorUsuario(parseInt(idUsuario)).subscribe({
      next: (idPersona) => {
        console.log('ID de persona obtenido:', idPersona);
        // Usar el idPersona como idCliente para obtener las encuestas pendientes
        this.encuestaService.obtenerCotizacionesPendientesEncuesta(idPersona).subscribe({
          next: (cotizaciones) => {
            console.log('Encuestas pendientes recibidas:', cotizaciones);
            this.encuestasPendientes = cotizaciones;
            this.loadingPendientes = false;
          },
          error: (error) => {
            console.error('Error al cargar cotizaciones pendientes:', error);
            this.toastService.show('Error al cargar las cotizaciones pendientes', 'danger');
            this.loadingPendientes = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener ID de persona:', error);
        this.toastService.show('Error al obtener la información del cliente', 'danger');
        this.loadingPendientes = false;
      }
    });
  }



  completarEncuesta(idRecibo: number, idCotizacion: number): void {
    this.router.navigate(['/encuesta-satisfaccion', idRecibo, idCotizacion]);
  }

  verDetalleEncuesta(encuesta: EncuestaSatisfaccionResponse): void {
    // Navegar a una página de detalle o mostrar modal
    this.router.navigate(['/detalle-encuesta-cliente', encuesta.idRecibo]);
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

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(monto);
  }

  refrescarDatos(): void {
    this.cargarEncuestasCompletadas();
    this.cargarEncuestasPendientes();
    this.toastService.show('Datos actualizados', 'success');
  }
} 
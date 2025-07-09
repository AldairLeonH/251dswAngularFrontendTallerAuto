import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EncuestaSatisfaccionService } from '../../service/encuesta-satisfaccion.service';
import { ToastService } from '../../service/toast.service';
import { EncuestaSatisfaccionResponse } from '../../model/encuesta-satisfaccion-response';

@Component({
  selector: 'app-detalle-encuesta-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-encuesta-cliente.component.html',
  styleUrls: ['./detalle-encuesta-cliente.component.css']
})
export class DetalleEncuestaClienteComponent implements OnInit {
  encuesta: EncuestaSatisfaccionResponse | null = null;
  loading: boolean = false;
  idRecibo: number = 0;

  constructor(
    private encuestaService: EncuestaSatisfaccionService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idRecibo = +params['idRecibo'];
      if (this.idRecibo) {
        this.cargarDetalleEncuesta();
      }
    });
  }

  cargarDetalleEncuesta(): void {
    this.loading = true;
    this.encuestaService.obtenerEncuestaPorRecibo(this.idRecibo).subscribe({
      next: (encuesta) => {
        this.encuesta = encuesta;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle de encuesta:', error);
        this.toastService.show('Error al cargar el detalle de la encuesta', 'danger');
        this.loading = false;
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

  obtenerEstrellas(puntaje: number): string {
    return '⭐'.repeat(puntaje);
  }

  redondear(numero: number): number {
    return Math.round(numero);
  }

  volverAEncuestas(): void {
    this.router.navigate(['/cliente-encuestas']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
} 
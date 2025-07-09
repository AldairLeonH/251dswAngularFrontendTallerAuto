import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReciboService, DetalleRecibo } from '../../service/recibo.service';
import { ToastService } from '../../service/toast.service';



@Component({
  selector: 'app-detalle-recibo-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-recibo-cliente.component.html',
  styleUrls: ['./detalle-recibo-cliente.component.css']
})
export class DetalleReciboClienteComponent implements OnInit {
  recibo: DetalleRecibo | null = null;
  loading: boolean = false;
  idRecibo: number = 0;

  constructor(
    private reciboService: ReciboService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idRecibo = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idRecibo) {
      this.cargarDetalleRecibo();
    }
  }

  cargarDetalleRecibo(): void {
    this.loading = true;
    
    this.reciboService.obtenerDetalleRecibo(this.idRecibo).subscribe({
      next: (recibo) => {
        this.recibo = recibo;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle del recibo:', error);
        this.toastService.show('Error al cargar el detalle del recibo', 'danger');
        this.loading = false;
      }
    });
  }

  descargarRecibo(): void {
    this.reciboService.descargarRecibo(this.idRecibo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recibo-${this.idRecibo}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastService.show('Recibo descargado exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error al descargar recibo:', error);
        this.toastService.show('Error al descargar el recibo', 'danger');
      }
    });
  }

  volverARecibos(): void {
    this.router.navigate(['/cliente-recibos']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/perfil']);
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto);
  }

  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADO': return 'danger';
      default: return 'secondary';
    }
  }

  obtenerTotalMateriales(): number {
    return this.recibo?.materiales.reduce((total, material) => total + material.subtotal, 0) || 0;
  }

  obtenerTotalServicios(): number {
    return this.recibo?.servicios.reduce((total, servicio) => total + servicio.precio, 0) || 0;
  }
} 
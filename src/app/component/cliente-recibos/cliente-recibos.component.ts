import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReciboService, ReciboCliente } from '../../service/recibo.service';
import { ToastService } from '../../service/toast.service';
import { UsuarioService } from '../../service/usuario.service';



@Component({
  selector: 'app-cliente-recibos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-recibos.component.html',
  styleUrls: ['./cliente-recibos.component.css']
})
export class ClienteRecibosComponent implements OnInit {
  recibos: ReciboCliente[] = [];
  loading: boolean = false;
  filtroEstado: string = 'TODOS';
  filtroFecha: string = '';

  constructor(
    private reciboService: ReciboService,
    private toastService: ToastService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.obtenerIdPersonaYRecibos();
  }

  obtenerIdPersonaYRecibos(): void {
    const idUsuario = Number(localStorage.getItem('idUsuario'));
    if (!idUsuario) {
      this.toastService.show('No se encontró el usuario autenticado', 'danger');
      this.loading = false;
      return;
    }
    this.usuarioService.getIdPersonaPorUsuario(idUsuario).subscribe({
      next: (idPersona) => {
        this.cargarRecibos(idPersona);
      },
      error: () => {
        this.toastService.show('No se pudo obtener la información del cliente', 'danger');
        this.loading = false;
      }
    });
  }

  cargarRecibos(idPersona: number): void {
    this.loading = true;
    this.reciboService.obtenerRecibosPorCliente(idPersona).subscribe({
      next: (recibos) => {
        this.recibos = recibos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar recibos:', error);
        this.toastService.show('Error al cargar los recibos', 'danger');
        this.loading = false;
      }
    });
  }

  filtrarRecibos(): ReciboCliente[] {
    let recibosFiltrados = this.recibos;

    // Filtro por estado
    if (this.filtroEstado !== 'TODOS') {
      recibosFiltrados = recibosFiltrados.filter(recibo => 
        recibo.estadoRecibo === this.filtroEstado
      );
    }

    // Filtro por fecha
    if (this.filtroFecha) {
      const fechaFiltro = new Date(this.filtroFecha);
      recibosFiltrados = recibosFiltrados.filter(recibo => {
        const fechaRecibo = new Date(recibo.fecha);
        return fechaRecibo.toDateString() === fechaFiltro.toDateString();
      });
    }

    return recibosFiltrados;
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'TODOS';
    this.filtroFecha = '';
  }

  verDetalleRecibo(idRecibo: number): void {
    this.router.navigate(['/detalle-recibo-cliente', idRecibo]);
  }

  descargarRecibo(idRecibo: number): void {
    this.reciboService.descargarRecibo(idRecibo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recibo-${idRecibo}.pdf`;
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

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  obtenerTotalRecibos(): number {
    return this.recibos.length;
  }

  obtenerTotalMonto(): number {
    return this.recibos.reduce((total, recibo) => total + recibo.montoTotal, 0);
  }

  obtenerRecibosActivos(): number {
    return this.recibos.filter(r => r.estadoRecibo === 'ACTIVO').length;
  }

  refrescarDatos(): void {
    this.obtenerIdPersonaYRecibos();
    this.toastService.show('Datos actualizados', 'success');
  }

  volverAlInicio(): void {
    this.router.navigate(['/perfil']);
  }
} 
import { Component, OnInit } from '@angular/core';
import { OstService } from '@service/ost.service';
import { IOstResponse } from '@model/ost-response';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
declare var bootstrap: any;


@Component({
  selector: 'app-ver-ost',
  imports: [CommonModule,NgxPaginationModule, FormsModule],
  templateUrl: './ver-ost.component.html',
  styleUrl: './ver-ost.component.css'
})
export class VerOstComponent  implements OnInit {
  // Filtros
filtroPlaca: string = '';
filtroCliente: string = '';
filtroEstado: string = '';
filtroModelo: string = '';

// Página actual
page: number = 1;

// Lista completa (ya debe existir)
listaOst: IOstResponse[] = [];
  constructor(private ostService: OstService) {}

  ngOnInit(): void {
    this.ostService.obtenerOsts().subscribe({
      next: (data) => this.listaOst = data,
      error: (err) => console.error('Error al obtener OSTs:', err)
    });
  }
  get ostFiltrados() {
    return this.listaOst.filter(ost =>
      (this.filtroPlaca === '' || ost.placa?.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
      (this.filtroCliente === '' || (`${ost.nombres} ${ost.apellidoPaterno}`.toLowerCase().includes(this.filtroCliente.toLowerCase()))) &&
      (this.filtroEstado === '' || ost.estado?.toLowerCase().includes(this.filtroEstado.toLowerCase())) &&
      (this.filtroModelo === '' || ost.modelo?.toLowerCase().includes(this.filtroModelo.toLowerCase()))
    );
  }

  ostSeleccionada: any;

  verDetalles(ost: IOstResponse) {
    this.ostSeleccionada = ost;
    const modal = new bootstrap.Modal(document.getElementById('modalVerOst'));
    modal.show();
  }

    asignarTecnico(ost: IOstResponse) {
    this.ostSeleccionada = ost;
    const modal = new bootstrap.Modal(document.getElementById('modalAsignarTecnico'));
    modal.show();
  }

  rolActual: string = localStorage.getItem('rol') || 'rol';
  mostrarEliminarOst(ost: IOstResponse) {
    if (this.rolActual === 'recepcionista') {
      this.ostSeleccionada = ost;
      const modal = new bootstrap.Modal(document.getElementById('modalEliminarOst')!);
      modal.show();
    } else {
      alert('No tienes permisos para eliminar OST.');
    }
  }

  
eliminarOst(id: number): void {
  this.ostService.eliminarOst(id).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'OST eliminada',
        text: 'La orden de servicio ha sido eliminada correctamente.',
        confirmButtonText: 'Aceptar'
      });

      // Cierra el modal manualmente
      const modal = document.getElementById('modalEliminarOst');
      if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal?.hide();
      }

      // Refresca la lista
      this.ostService.obtenerOsts().subscribe({
      next: (data) => this.listaOst = data,
      error: (err) => console.error('Error al obtener OSTs:', err)
    });
    },
    error: (err) => {
      console.error('Error al eliminar OST:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar la OST.'
      });
    }
  });
}

}
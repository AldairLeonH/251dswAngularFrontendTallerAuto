import { Component, OnInit } from '@angular/core';
import { OstService } from '@service/ost.service';
import { IOstResponse } from '@model/ost-response';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-cliente-ost',
  imports: [CommonModule,NgxPaginationModule, FormsModule],
  templateUrl: './cliente-ost.component.html',
  styleUrl: './cliente-ost.component.css'
})
export class ClienteOstComponent  implements OnInit {
  // Filtros
filtroPlaca: string = '';
filtroEstado: string = '';
filtroModelo: string = '';

// Página actual
page: number = 1;
  userId = Number(localStorage.getItem('idUsuario'));
// Lista completa (ya debe existir)
listaOst: IOstResponse[] = [];
  constructor(private ostService: OstService) {}

  ngOnInit(): void {
    this.ostService.obtenerOstPorCliente(this.userId).subscribe({
      next: (data) => this.listaOst = data,
      error: (err) => console.error('Error al obtener OSTs:', err)
    });
  }
  get ostFiltrados() {
    return this.listaOst.filter(ost =>
      (this.filtroPlaca === '' || ost.placa?.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
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


}
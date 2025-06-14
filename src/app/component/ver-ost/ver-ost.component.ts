import { Component, OnInit } from '@angular/core';
import { OstService } from '@service/ost.service';
import { IOstResponse } from '@model/ost-response';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule, FormArray } from '@angular/forms';
import { OstTecnicoService } from '@service/ost-tecnico.service';

import Swal from 'sweetalert2';
import { TecnicoService } from '@service/tecnico.service';
import { EstadoService } from '@service/tipo-estado.service';
declare var bootstrap: any;


@Component({
  selector: 'app-ver-ost',
  imports: [CommonModule,NgxPaginationModule, FormsModule, ReactiveFormsModule ],
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

asignacionForm!: FormGroup;
tecnicos: any[] = [];
estados: any[] = [];
esSupervisor: boolean = false;

// Lista completa (ya debe existir)
listaOst: IOstResponse[] = [];
  constructor(private fb: FormBuilder,private ostService: OstService, private estadoService: EstadoService,
    private ostTecnicoService: OstTecnicoService , private tecnicoService: TecnicoService) {}

  ngOnInit(): void {
    this.ostService.obtenerOsts().subscribe({
      next: (data) => this.listaOst = data,
      error: (err) => console.error('Error al obtener OSTs:', err)
    });

      const rolUsuario = localStorage.getItem('rol'); // O desde tu AuthService
  this.esSupervisor = rolUsuario === 'supervisor';

    this.asignacionForm = this.fb.group({
      asignaciones: this.fb.array([])
    });

    this.cargarTecnicos();
    this.cargarEstados();
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

  cargarTecnicos() {
    this.tecnicoService.obtenerTodos().subscribe((data) => {
      this.tecnicos = data;
          console.log('Técnicos cargados:', this.tecnicos);
    });
  }
getInfoTecnico(id: any) {
  if (!id) return null;
  return this.tecnicos.find(t => t.idTecnico === +id);
}

  onTecnicoChange(event: Event, index: number) {
  const value = (event.target as HTMLSelectElement).value;
  const tecnicoId = +value;
  console.log('Técnico seleccionado en posición', index, ':', tecnicoId);
}
  cargarEstados() {
    this.estadoService.getEstados().subscribe(data => {
      this.estados = data;
    });
  }

  get asignaciones(): FormArray {
    return this.asignacionForm.get('asignaciones') as FormArray;
  }

  asignarTecnico(ost: any) {
    this.ostSeleccionada = ost;
    this.asignaciones.clear(); // Limpia cualquier asignación anterior
    this.agregarAsignacion(); // Agrega uno por defecto

    // Abre el modal (Bootstrap 5)
    const modal = new bootstrap.Modal(document.getElementById('modalAsignarTecnico')!);
    modal.show();
  }

  agregarAsignacion() {
    this.asignaciones.push(
      this.fb.group({
        idTecnico: [null, Validators.required],
        idEstado: [null, Validators.required],
        observaciones: ['']
      })
    );
  }

  tecnicosFiltrados(index: number): any[] {
    const asignaciones = this.asignacionForm.get('asignaciones')?.value;

    // Obtiene IDs de técnicos ya seleccionados, excepto el de la fila actual
    const seleccionados = asignaciones
      .map((a: any, i: number) => i !== index ? a.idTecnico : null)
      .filter((id: any) => id !== null);

    return this.tecnicos.filter(t => !seleccionados.includes(t.idTecnico));
  }

  confirmarAsignacion() {
    if (this.asignacionForm.invalid || !this.ostSeleccionada) {
      Swal.fire('Error', 'Completa todos los campos.', 'error');
      return;
    }

    const dto = {
      idOst: this.ostSeleccionada.idOst,
      asignaciones: this.asignacionForm.value.asignaciones
    };

    this.ostTecnicoService.asignarTecnicos(dto).subscribe(() => {
      Swal.fire('Éxito', 'Técnicos asignados correctamente.', 'success');
      this.asignacionForm.reset();
      this.asignaciones.clear();
      // cerrar modal manualmente si usas Bootstrap 5
      const modal = document.getElementById('modalAsignarTecnico');
      if (modal) bootstrap.Modal.getInstance(modal)?.hide();
    });
  }


  eliminarAsignacion(index: number) {
    this.asignaciones.removeAt(index);
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

  cargarDatos(){
    this.ostService.obtenerOsts().subscribe({
          next: (data) => this.listaOst = data,
          error: (err) => console.error('Error al obtener OSTs:', err)
    });
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
        this.cargarDatos();
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
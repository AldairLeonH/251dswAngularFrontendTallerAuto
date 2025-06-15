import { Component, OnInit } from '@angular/core';
import { OstService } from '@service/ost.service';
import { IOstResponse } from '@model/ost-response';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule, FormArray } from '@angular/forms';
import { OstTecnicoService } from '@service/ost-tecnico.service';

import Swal from 'sweetalert2';
<<<<<<< Updated upstream
import { TecnicoService } from '@service/tecnico.service';
import { EstadoService } from '@service/tipo-estado.service';
=======
import { IMaterialResponse } from '@model/material-response';
import { IServicioResponse } from '@model/servicio-response';
import { MaterialService } from '@service/material.service';
import { ServicioService } from '@service/servicio.service';
import { ICotizacionRequest } from '@model/cotizacion-request';
import { CotizacionService } from '@service/cotizacion.service';
import { IAgregarMultiplesServiciosRequest } from '@model/agregar-multiples-servicios-request';
import { ICotizacionMultiplesServiciosResponse } from '@model/cotizacion-multiples-servicios-response';
import { IMaterialCotizacionRequest } from '@model/material-cotizacion-request';
import { IAgregarMultiplesMaterialesRequest } from '@model/agregar-multiples-materiales-request';
import { ICotizacionMultiplesMaterialesResponse } from '@model/cotizacion-multiples-materiales-response';
import { forkJoin } from 'rxjs';
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  constructor(private fb: FormBuilder,private ostService: OstService, private estadoService: EstadoService,
    private ostTecnicoService: OstTecnicoService , private tecnicoService: TecnicoService) {}
=======
materialesArray:IMaterialResponse [] =[];
serviciosArray: IServicioResponse[] = [];
cotizacionRequest:ICotizacionRequest = {} as ICotizacionRequest;
idCotizacionActual: number = 0; // Variable para almacenar el ID de la cotización actual
// Variables para manejar la cotización de múltiples servicios
serviciosSeleccionados: number[] = [];// Array para almacenar los IDs de los servicios seleccionados
serviciosCotizacionRequest :IAgregarMultiplesServiciosRequest = {} as IAgregarMultiplesServiciosRequest;
serviciosCotizacionResponse: ICotizacionMultiplesServiciosResponse = {} as ICotizacionMultiplesServiciosResponse;
// Variables para manejar materiales
materialesSeleccionados: IMaterialCotizacionRequest[] = [];
materialCotizacionRequest: IAgregarMultiplesMaterialesRequest = {} as IAgregarMultiplesMaterialesRequest;
materialCotizacionResponse: ICotizacionMultiplesMaterialesResponse = {} as ICotizacionMultiplesMaterialesResponse; 
  constructor(private ostService: OstService, private materialService:MaterialService, private servicioService:ServicioService, private cotizacionService:CotizacionService) {}
>>>>>>> Stashed changes

  ngOnInit(): void {
    this.getMateriales(); // Llamamos al método para obtener los materiales
    this.getServicios(); // Llamamos al método para obtener los servicios
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
<<<<<<< Updated upstream
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
=======
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
//cotizaciones
//3
  setCotizacionRequest(ost: IOstResponse): void {
    this.cotizacionRequest = {
      idOst: ost.idOst,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      total: 0, // Inicializamos el total en 0
    }
  }
  //1
  generarCotizacionInicial(ost: IOstResponse) {
    Swal.fire({ 
      title: '¿Está seguro de generar una nueva cotización?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'Sí',
      focusCancel: true,
      text: 'Por favor espere',
      allowOutsideClick: false,
    }).then((result) => {
      if(result.isConfirmed) {
        this.crearNuevaCotizacionInicial(ost);
        this.abrirModalCotizacion(ost);
        
      } 
      

    });
  }
  //2  
  crearNuevaCotizacionInicial(ost: IOstResponse) {
    this.setCotizacionRequest(ost);
    this.cotizacionService.registrarCotizacion(this.cotizacionRequest).subscribe({
      next: (response) => {
        this.idCotizacionActual = response.id; // Guardamos el ID de la cotización actual
        console.log('Cotización registrada con éxito:', response);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Cotización generada correctamente',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al registrar la cotización:', error);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar la cotización. Intente nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });



  }  
  abrirModalCotizacion(ost: IOstResponse) {
    this.ostSeleccionada = ost;
    const modal = new bootstrap.Modal(document.getElementById('modalCotizacion'));
    modal.show();
  }
  getMateriales():void{ //lleamos el array de materiales
    this.materialService.getMateriales().subscribe(
      (result: any) => {
        this.materialesArray = result;
        console.log('Materiales:', this.materialesArray);
      },
      (err:any) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los materiales',
          confirmButtonText: 'Aceptar'
        });
      }
    )
  }
  getServicios():void{//lleamos el array de servicios
    this.servicioService.getServicios().subscribe(
      (result: any) => {
        this.serviciosArray = result;
        console.log('Servicios:', this.serviciosArray);
      },
      (err:any) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los servicios',
          confirmButtonText: 'Aceptar'
        });
      }
    )
  }
  agregarServicio(servicio: IServicioResponse): void {
    if (!this.serviciosSeleccionados.includes(servicio.id)) {
      this.serviciosSeleccionados.push(servicio.id);
      this.mostrarToast(`${servicio.nombre} agregado`, 'success');
    }
    console.log('Servicios seleccionados:', this.serviciosSeleccionados);
  }

  eliminarServicio(idServicio: number): void {
    const index = this.serviciosSeleccionados.indexOf(idServicio);
    if (index > -1) {
      this.serviciosSeleccionados.splice(index, 1);
      const servicio = this.serviciosArray.find(s => s.id === idServicio);
      if (servicio) {
        this.mostrarToast(`${servicio.nombre} eliminado`, 'warning');
      }
    }
    console.log('Servicios seleccionados:', this.serviciosSeleccionados);
  }

  // Método auxiliar para notificaciones
  private mostrarToast(mensaje: string, tipo: 'success' | 'warning' | 'error'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: tipo,
      title: mensaje
    });
  }
  agregarMaterial(material: IMaterialResponse, cantidad: number): void {
    // Validaciones básicas
    if (!material || !material.id) {
      console.error('Material inválido');
      return;
    }

    if (!cantidad || cantidad <= 0) {
      this.mostrarToast('La cantidad debe ser mayor a 0', 'error');
      return;
    }

    if (cantidad > material.stock) {
      this.mostrarToast(`No hay suficiente stock. Disponible: ${material.stock}`, 'error');
      return;
    }

    // Crear el objeto materialSeleccionado
    const materialSeleccionado: IMaterialCotizacionRequest = {
      idMaterial: material.id,
      cantidad: cantidad
    };

    // Verificar si el material ya existe en el array
    const indiceExistente = this.materialesSeleccionados.findIndex(
      m => m.idMaterial === materialSeleccionado.idMaterial
    );

    if (indiceExistente !== -1) {
      // Actualizar cantidad si ya existe
      this.materialesSeleccionados[indiceExistente].cantidad = materialSeleccionado.cantidad;
      this.mostrarToast(`Cantidad de ${material.nombre} actualizada`, 'success');
    } else {
      // Agregar nuevo material al array
      this.materialesSeleccionados.push(materialSeleccionado);
      this.mostrarToast(`${material.nombre} agregado a la cotización`, 'success');
    }

    console.log('Materiales seleccionados:', this.materialesSeleccionados);
  }

  // Método para eliminar material del array
  eliminarMaterial(idMaterial: number): void {
    // Validación básica
    if (!idMaterial) {
      console.error('ID de material inválido');
      return;
    }

    // Buscar el material en el array para mostrar su nombre en el mensaje
    const material = this.materialesArray.find(m => m.id === idMaterial);
    
    // Filtrar el array para remover el material
    this.materialesSeleccionados = this.materialesSeleccionados.filter(m => m.idMaterial !== idMaterial);

    // Mostrar feedback al usuario
    if (material) {
      this.mostrarToast(`${material.nombre} eliminado de la cotización`, 'warning');
    } else {
      this.mostrarToast('Material eliminado', 'warning');
    }

    console.log('Materiales seleccionados después de eliminar:', this.materialesSeleccionados);
  }
  // Método para verificar si un material está seleccionado
  isMaterialSeleccionado(idMaterial: number): boolean {
    return this.materialesSeleccionados.some(m => m.idMaterial === idMaterial);
  }

  // Método para obtener la cantidad seleccionada de un material
  getCantidadSeleccionada(idMaterial: number): number | null {
    const material = this.materialesSeleccionados.find(m => m.idMaterial === idMaterial);
    return material ? material.cantidad : null;
  }
// Métodos para el resumen
  getNombreMaterial(idMaterial: number): string {
    const material = this.materialesArray.find(m => m.id === idMaterial);
    return material ? material.nombre : 'Material no encontrado';
  }

  getPrecioMaterial(idMaterial: number): number {
    const material = this.materialesArray.find(m => m.id === idMaterial);
    return material ? material.precio : 0;
  }

  calcularSubtotalMaterial(item: IMaterialCotizacionRequest): number {
    const precio = this.getPrecioMaterial(item.idMaterial);
    return precio * item.cantidad;
  }

  getNombreServicio(idServicio: number): string {
    const servicio = this.serviciosArray.find(s => s.id === idServicio);
    return servicio ? servicio.nombre : 'Servicio no encontrado';
  }

  getPrecioServicio(idServicio: number): number {
    const servicio = this.serviciosArray.find(s => s.id === idServicio);
    return servicio ? servicio.precio : 0;
  }

  calcularTotal(): number {
    // Sumar materiales
    const totalMateriales = this.materialesSeleccionados.reduce((sum, item) => {
      return sum + (this.getPrecioMaterial(item.idMaterial) * item.cantidad);
    }, 0);

    // Sumar servicios
    const totalServicios = this.serviciosSeleccionados.reduce((sum, id) => {
      return sum + this.getPrecioServicio(id);
    }, 0);

    return totalMateriales + totalServicios;
  }
  //fin metodos resumen
  //preparmos los requests de cotizacion para enviar al backend
  setserviciosCotizacionRequest(): void {
    this.serviciosCotizacionRequest = {
      idCotizacion: this.idCotizacionActual,
      idServicios: this.serviciosSeleccionados

    };
  }
  setMaterialCotizacionRequest(): void {
    this.materialCotizacionRequest = {
      idCotizacion: this.idCotizacionActual,
      materiales: this.materialesSeleccionados

    };
  }
  generarCotizacionCompleta(): void {
    this.setMaterialCotizacionRequest();
    this.setserviciosCotizacionRequest();

    const materiales$ = this.cotizacionService.agregarMaterialesACotizacion(this.materialCotizacionRequest);
    const servicios$ = this.cotizacionService.agregarServiciosACotizacion(this.serviciosCotizacionRequest);
    const actualizarTotal$ = this.cotizacionService.actualizarTotalCotizacion({
      idCotizacion: this.idCotizacionActual,
      nuevoTotal: this.calcularTotal()
    });

    forkJoin([materiales$, servicios$, actualizarTotal$]).subscribe({
      next: ([resMat, resSer, resTotal]) => {
        this.materialCotizacionResponse = resMat;
        this.serviciosCotizacionResponse = resSer;
        console.log('Materiales:', resMat);
        console.log('Servicios:', resSer);
        console.log('Total actualizado:', resTotal);

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Cotización generada correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al generar cotización completa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al generar la cotización.'
        });
      }
    });
        // 1. Cerrar el modal
        const modal = document.getElementById('modalCotizacion');
>>>>>>> Stashed changes
        if (modal) {
          const bootstrapModal = bootstrap.Modal.getInstance(modal);
          bootstrapModal?.hide();
        }

<<<<<<< Updated upstream
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
=======
        // 2. Vaciar los arrays
        this.materialesSeleccionados = [];
        this.serviciosSeleccionados = [];    
  } 


>>>>>>> Stashed changes

}
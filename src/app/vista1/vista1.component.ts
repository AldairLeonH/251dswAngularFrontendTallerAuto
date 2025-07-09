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
import { OstTecnicoResponse } from '@model/ost-tecnico-response';

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
import { OstTecnicoCompletoDTO } from '@model/ost-tecnico-completo-response';

declare var bootstrap: any;


@Component({
  selector: 'app-vista1',
  imports: [CommonModule,NgxPaginationModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './vista1.component.html',
  styleUrl: './vista1.component.css'
})
export class Vista1Component  implements OnInit {
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
esTecnico: boolean = false;
asignados: OstTecnicoResponse[] = [];
listaAsignaciones: OstTecnicoCompletoDTO[] = [];
idTecnico: number = 1;

// Lista completa (ya debe existir)
listaOst: IOstResponse[] = [];
asignacionSeleccionada!: OstTecnicoCompletoDTO;

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
  constructor(
  private fb: FormBuilder,
  private ostService: OstService,
  private estadoService: EstadoService,
  private ostTecnicoService: OstTecnicoService,
  private tecnicoService: TecnicoService,
  // Nuevos servicios para cotización
  private materialService: MaterialService,
  private servicioService: ServicioService,
  private cotizacionService: CotizacionService
) {}


  ngOnInit(): void {
    const rolUsuario = localStorage.getItem('rol');
    this.idTecnico = Number(localStorage.getItem('idUsuario'));
    //this.esSupervisor = rolUsuario === 'supervisor';
    this.esTecnico = rolUsuario === 'tecnico';
      if (this.esTecnico) {
        this.ostTecnicoService.getOstsPorTecnico(this.idTecnico).subscribe({
          next: (data) => {
            this.listaOst = data.map(item => item.ost); // si solo quieres ver las OST
            this.listaAsignaciones = data; // si quieres mostrar también la fechaAsignacion, estado, etc.
          },
          error: (err) => console.error('Error al obtener OSTs del técnico:', err)
        });
      } else {
        this.ostService.obtenerOsts().subscribe({
          next: (data) => this.listaOst = data,
          error: (err) => console.error('Error al obtener OSTs:', err)
        });
      }

    this.asignacionForm = this.fb.group({
      asignaciones: this.fb.array([])
    });

    //this.cargarTecnicos();
    this.cargarEstados();
  }

  get ostFiltrados() {
    return this.listaOst
      .filter(ost => ost != null) // Filtrar elementos nulos
      .filter(ost =>
        (this.filtroPlaca === '' || ost.placa?.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
        (this.filtroCliente === '' || (`${ost.nombres} ${ost.apellidoPaterno}`.toLowerCase().includes(this.filtroCliente.toLowerCase()))) &&
        (this.filtroEstado === '' || ost.estado?.toLowerCase().includes(this.filtroEstado.toLowerCase())) &&
        (this.filtroModelo === '' || ost.modelo?.toLowerCase().includes(this.filtroModelo.toLowerCase()))
      );
  }
  get listaAsignacionesFiltradas() {
    return this.listaAsignaciones
      .filter(asignacion => asignacion.ost != null)
      .filter(asignacion =>
        (this.filtroPlaca === '' || asignacion.ost.placa?.toLowerCase().includes(this.filtroPlaca.toLowerCase())) &&
        (this.filtroCliente === '' || (`${asignacion.ost.nombres} ${asignacion.ost.apellidoPaterno}`.toLowerCase().includes(this.filtroCliente.toLowerCase()))) &&
        (this.filtroEstado === '' || asignacion.ost.estado?.toLowerCase().includes(this.filtroEstado.toLowerCase())) &&
        (this.filtroModelo === '' || asignacion.ost.modelo?.toLowerCase().includes(this.filtroModelo.toLowerCase()))
      );
  }


  ostSeleccionada: any;

  verDetalles(ost: IOstResponse) {
    this.ostSeleccionada = ost;
    const modal = new bootstrap.Modal(document.getElementById('modalVerOst'));
    modal.show();
  }

  cargarEstados() {
    this.estadoService.getEstados().subscribe(data => {
      this.estados = data;
    });
  }

confirmarFinalizacion(): void {
 const estadoTerminado = this.estados.find(e => e.estado?.toLowerCase() === 'atendida')?.id;
  const idTecnico = Number(localStorage.getItem('idUsuario'));
        console.log(estadoTerminado);
    console.log(this.idTecnico);
    console.log(this.ostSeleccionada);
  if (!estadoTerminado || !this.ostSeleccionada || !idTecnico) {

    Swal.fire('Error', 'Faltan datos necesarios', 'error');
    return;
  }console.log('Finalizando trabajo para OST:', this.ostSeleccionada.idOst);
console.log('Técnico:', idTecnico);
console.log('Observaciones:', this.observacionFinal);

  this.ostTecnicoService.finalizarTrabajo(
    this.ostSeleccionada.idOst,
    idTecnico,
    this.observacionFinal
  ).subscribe({
    next: () => {
      Swal.fire('Éxito', 'La tarea ha sido finalizada correctamente', 'success');
      const modal = document.getElementById('modalFinalizar');
      if (modal) bootstrap.Modal.getInstance(modal)?.hide();
      // Actualizar visualmente
      this.ostSeleccionada.estado = 'Atendida';
    },
error: (err) => {
  console.error('Error al finalizar:', err);
  Swal.fire('Error', 'No se pudo finalizar la tarea', 'error');
}
  });
}



cambiarEstadoTecnico(ost: IOstResponse) {
  const idOst = ost.idOst;
  const idTecnico = Number(localStorage.getItem('idUsuario')); // el técnico actual
  const idEstado = 2; // por ejemplo, "Finalizado"

  this.ostTecnicoService.actualizarEstadoOstTecnico(idOst, idTecnico, idEstado)
    .subscribe(() => {
      Swal.fire('Éxito', 'Tu estado como técnico ha sido actualizado.', 'success');
    });
}

descripcionAvance: string = '';
archivoSeleccionado: File | null = null;

onFileSelected(event: any) {
  this.archivoSeleccionado = event.target.files[0];
}

registrarAvance(ost: IOstResponse) {
  if (!this.archivoSeleccionado || !ost || !this.idTecnico
  ) {
    Swal.fire('Error', 'Debes seleccionar un archivo y una OST válida', 'error');
    return;
  }

  this.ostTecnicoService.subirEvidencia(
    this.archivoSeleccionado,
    ost.idOst,
    this.idTecnico,
    this.descripcionAvance
  ).subscribe({
    next: (data) => {
    console.log('Respuesta del backend:', data); 
      const estadoProceso = this.estados.find(e => e.nombre.toLowerCase() === 'En Proceso')?.id;
          console.log(this.ostSeleccionada);
    console.log(this.idTecnico);
    console.log(this.archivoSeleccionado?.name);
        this.ostService.actualizarEstadoOst(
          ost.idOst, estadoProceso
        ).subscribe(() => {
          Swal.fire('Éxito', 'Avance registrado y estado actualizado a Proceso', 'success');
          const modal = document.getElementById('modalAvance');
          if (modal) bootstrap.Modal.getInstance(modal)?.hide();
        });
    },
    error: () => {
          console.log(this.ostSeleccionada.idOst);
          console.log(ost.idOst);
    console.log(this.idTecnico);
    console.log(this.archivoSeleccionado?.name);
      Swal.fire('Error', 'Error al registrar evidencia', 'error');
    }
  });
  this.cambiarEstadoTecnico(ost);
}
observacionFinal: string = '';

abrirModalFinalizar(ost: IOstResponse): void {
  this.ostSeleccionada = ost;
  this.observacionFinal = ''; // limpiar anterior
  const modal = new bootstrap.Modal(document.getElementById('modalFinalizar'));
  modal.show();
}



abrirModalAvance(asignacion: OstTecnicoCompletoDTO) {
  this.asignacionSeleccionada = asignacion;
  this.descripcionAvance = '';
  this.archivoSeleccionado = null;
  const modal = new bootstrap.Modal(document.getElementById('modalAvance')!);
  modal.show();
}
  getColorEstado(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'estado-pendiente';
      case 'en proceso': return 'estado-en-proceso';
      case 'atendida': return 'estado-atendida';
      default: return '';
    }
  }
  abrirCotizacionExistente(ost: IOstResponse) {
        //this.getMateriales(); // Llamamos al método para obtener los materiales
    //this.getServicios(); // Llamamos al método para obtener los servicioss
    this.cotizacionService.getCotizacionPorOst(ost.idOst).subscribe({
      next: (cotizacion) => {
        this.idCotizacionActual = cotizacion.id;
        this.abrirModalCotizacion(ost);
        // Cargar materiales y servicios ya registrados si deseas
      },
      error: () => {
        Swal.fire('Error', 'No se encontró cotización para esta OST', 'error');
      }
    });
  }

  
//cotizaciones
//3
  setCotizacionRequest(ost: IOstResponse): void {
    if (!ost || !ost.idOst) {
      console.error('OST inválida o sin ID:', ost);
      throw new Error('OST inválida para crear cotización');
    }
    
    this.cotizacionRequest = {
      idOst: ost.idOst,
      fecha: new Date().toISOString(), // Fecha actual en formato ISO completo
      total: 0, // Inicializamos el total en 0
    }
  }
  //1
  generarCotizacionInicial(ost: IOstResponse) {
    this.getMateriales(); // Llamamos al método para obtener los materiales
    this.getServicios(); // Llamamos al método para obtener los servicios
    if (!ost || !ost.idOst) {
      console.error('OST inválida para generar cotización:', ost);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'OST inválida para generar cotización',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

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
        // El modal se abrirá después de que se cree la cotización exitosamente
      } 
    });
  }
  //2  
    crearNuevaCotizacionInicial(ost: IOstResponse) {
    try {
      this.setCotizacionRequest(ost);
      console.log('Datos de cotización a enviar:', this.cotizacionRequest);
      this.cotizacionService.registrarCotizacion(this.cotizacionRequest).subscribe({
        next: (response) => {
          this.idCotizacionActual = response.id; // Guardamos el ID de la cotización actual
          console.log('Cotización registrada con éxito:', response);
          Swal.close();
          // Abrir el modal después de crear la cotización exitosamente
          this.abrirModalCotizacion(ost);
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
          
          let errorMessage = 'No se pudo generar la cotización. Intente nuevamente.';
          
          if (error.status === 400) {
            // Error de validación
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Datos de cotización inválidos. Verifique la información.';
            }
          } else if (error.status === 404) {
            errorMessage = 'No se encontró la orden de servicio especificada.';
          } else if (error.status === 500) {
            errorMessage = 'Error interno del servidor. Contacte al administrador.';
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } catch (error) {
      console.error('Error al preparar la cotización:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al preparar la cotización: ' + (error as Error).message,
        confirmButtonText: 'Aceptar'
      });
    }
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
    // Validar que tenemos un ID de cotización válido
    if (!this.idCotizacionActual || this.idCotizacionActual <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha creado una cotización válida. Por favor, intente nuevamente.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

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
        if (modal) {
          const bootstrapModal = bootstrap.Modal.getInstance(modal);
          bootstrapModal?.hide();
        
      }
        // 2. Vaciar los arrays
        this.materialesSeleccionados = [];
        this.serviciosSeleccionados = [];
  }   
   


}
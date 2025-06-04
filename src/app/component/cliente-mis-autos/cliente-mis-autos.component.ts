import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAutoResponse } from '@model/auto-response';
import { IMarca } from '@model/marca';
import { IModelo } from '@model/modelo';
import { IUsuarioResponse } from '@model/usuario-response';
import { MarcaService } from '@service/marca.service';
import { ModeloService } from '@service/modelo.service';
import { PersonaService } from '@service/persona.service';
import { UsuarioService } from '@service/usuario.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { IAutoRequest } from '@model/auto-request';
import Swal from 'sweetalert2';
import { AutoService } from '@service/auto.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cliente-mis-autos',
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './cliente-mis-autos.component.html',
  styleUrl: './cliente-mis-autos.component.css'
})
export class ClienteMisAutosComponent {




  modalAgregarAutoInstance: any;
  modalEditarAutoInstance: any;

  userId = Number(localStorage.getItem('idUsuario'));
  personaId: number = 0;
  autosArray: IAutoResponse[] = [];
  marcasArray: IMarca[] = [];
  modelosArray: IModelo[] = [];
  modelosFiltrados: IModelo[] = [];
  autoRequestAdd: IAutoRequest = {} as IAutoRequest;
  autoRequestEdit: IAutoRequest = {} as IAutoRequest;
  //autoResponse: IAutoResponse = {} as IAutoResponse;
  usuarioResponse: IUsuarioResponse = {} as IUsuarioResponse;
  //autoFormEdit:FormGroup;
  autoFormAdd:FormGroup;
  autoFormEdit:FormGroup;
  page: number = 1;

  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private autoService: AutoService 
  ) 
  {
    this.autoFormAdd = new FormGroup({
      idAuto: new FormControl(''),
      placa: new FormControl('', [Validators.required]),
      idModelo: new FormControl('', [Validators.required]),
      idMarca: new FormControl('', [Validators.required]),
      //idPersona: new FormControl(this.personaId, [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),

    });
    this.autoFormEdit = new FormGroup({
      idAuto: new FormControl(''),
      placa: new FormControl('', [Validators.required]),
      idModelo: new FormControl('', [Validators.required]),
      idMarca: new FormControl('', [Validators.required]),
      //idPersona: new FormControl(this.personaId, [Validators.required]),
      anio: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),

    });
  }
  ngOnInit(): void {
    this.getAutosDePersona();
    this.getMarcas();
    this.getModelos();

  }
  getModelos() {
    this.modeloService.getTodosModelos().subscribe ({ 
      next: (response:IModelo[]) => {
        this.modelosArray = response;
        console.log('Modelos obtenidos:', this.modelosArray);

      },
      error: (err) => console.error('Error al obtener los modelos:', err) 


    });

  }
  getMarcas() {
    this.marcaService.getMarcas().subscribe({
      next: (response: IMarca[]) => {
        this.marcasArray = response;
        console.log('Marcas obtenidas:', this.marcasArray);
      },
      error: (err) => console.error('Error al obtener las marcas:', err)
    });

  }
  getAutosDePersona(){
    this.usuarioService.getUsuarioById(this.userId).subscribe({
      next: (data) => {
        this.usuarioResponse = data;
        this.personaId = this.usuarioResponse.persona.idPersona;
        // ACTUALIZAR el valor del campo en el formulario
        //this.autoFormAdd.get('idPersona')?.setValue(this.personaId);
        //this.autoFormAdd.get('idPersona')?.updateValueAndValidity();
        console.log('Usuario obtenido:', this.usuarioResponse);
        
        // Llamar a getAutos después de obtener personaId
        this.getAutos();
      },
      error: (err) => console.error('Error al obtener el usuario:', err)
    });
  }
  getAutos(){
    this.personaService.getAutosPorPersona(this.personaId).subscribe({
      next: (data) => {
        this.autosArray = data;
        console.log('Autos obtenidos:', this.autosArray);
      },
      error: (err) => console.error('Error al obtener los autos:', err)
    });
  }
  mostrarAgregarAuto() {
    this.autoFormAdd.reset();
    const modalElement = document.getElementById('modalAgregarAuto')!;// Inicializar con todos los modelos
    this.modalAgregarAutoInstance = new bootstrap.Modal(modalElement);
    this.modalAgregarAutoInstance.show();
  }
  onMarcaChange(event: Event):void {
    const marcaId = +(event.target as HTMLSelectElement).value;
    this.modelosFiltrados = this.modelosArray.filter(m => m.marca.idMarca === marcaId);
  }
  setAutoRequestAdd() {
    this.autoRequestAdd.idAuto = 0; // Asignar un valor por defecto o dejarlo como 0 si es autogenerado
    this.autoRequestAdd.placa = this.autoFormAdd.get('placa')?.value;
    this.autoRequestAdd.idModelo = this.autoFormAdd.get('idModelo')?.value;
    this.autoRequestAdd.idPersona = this.personaId;
    this.autoRequestAdd.anio = this.autoFormAdd.get('anio')?.value;
    this.autoRequestAdd.color = this.autoFormAdd.get('color')?.value;
  }
  setAutoRequestEdit() {
    this.autoRequestEdit.idAuto = this.autoFormEdit.get('idAuto')?.value;
    this.autoRequestEdit.placa = this.autoFormEdit.get('placa')?.value;
    this.autoRequestEdit.idModelo = this.autoFormEdit.get('idModelo')?.value;
    this.autoRequestEdit.idPersona = this.personaId; 
    this.autoRequestEdit.anio = this.autoFormEdit.get('anio')?.value;
    this.autoRequestEdit.color = this.autoFormEdit.get('color')?.value;
  }
  confirmarAgregarAuto():void {
    if (this.autoFormAdd.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios.',
      });
      return;
    }

    Swal.fire({
      title: '¿Está seguro de añadir un nuevo auto ?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'Sí',
      focusCancel: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.setAutoRequestAdd();
        this.autoService.registrarAuto(this.autoRequestAdd).subscribe({
          next: () => {
            this.ngOnInit();
            this.modalAgregarAutoInstance.hide();
            Swal.fire({
              icon: 'success',
              title: 'Nuevo auto Añadido',
              text: '¡Se ha registrado exitosamente!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar el auto',
            });
            console.error('Error al registrar el auto:', error);
          }
        });
        
      }
    });   



  }
  mostrarEditarAuto(autoResponse: IAutoResponse) {
    const modalElement = document.getElementById('modalEditarAuto')!;
    this.modalEditarAutoInstance = new bootstrap.Modal(modalElement);
    this.modalEditarAutoInstance.show();
    this.autoFormEdit.patchValue({
      idAuto: autoResponse.idAuto,
      placa: autoResponse.placa,
      idMarca: autoResponse.modelo.marca.idMarca,
      idModelo: autoResponse.modelo.idModelo, 
      //idPersona: autoResponse.persona.idPersona, // No es necesario si no se edita
      anio: autoResponse.anio,
      color: autoResponse.color
    });
  }
  confirmarEditarAuto():void {
    Swal.fire({ 
      title: '¿Está seguro de de editar los datos del auto?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'Sí',
      focusCancel: true,
      text: 'Por favor espere',
      allowOutsideClick: false,
    }).then((result) => {
      if(result.isConfirmed) {
        this.setAutoRequestEdit();
        this.actualizarAuto();
      } 
    }); 


  }
  actualizarAuto() {
    this.autoService.actualizarAuto(this.autoRequestEdit).subscribe({
      next: () => {
        this.ngOnInit();
        this.modalEditarAutoInstance.hide();
        Swal.fire({
          icon: 'success',
          title: 'Auto Editado',
          text: '¡Se ha editado exitosamente el auto seleccionado!',
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo editar el auto',
        });
        console.error('Error al editar el auto:', error);
      }
    });
  }
  eliminarAuto(autoResponse: IAutoResponse) {
    this.autoRequestEdit.idAuto = autoResponse.idAuto;
    Swal.fire({
      title: '¿Está seguro de eliminar el auto?',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonText: 'Sí',
      focusCancel: true,
      text: 'Por favor espere',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.autoService.eliminarAuto(this.autoRequestEdit).subscribe({
          next: () => {
            this.ngOnInit();
            Swal.fire({
              icon: 'success',
              title: 'Auto Eliminado',
              text: '¡Se ha eliminado exitosamente el auto seleccionado!',
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el auto',
            });
            console.error('Error al eliminar el auto:', error);
          }
        });
      }
    });
  }




}

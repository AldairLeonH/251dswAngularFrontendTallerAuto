import { Component, Directive } from '@angular/core';
import { IUsuarioResponse } from '../../model/usuario-response';
import { IUsuarioRequest } from '../../model/usuario-request';
import { CommonModule } from '@angular/common';
import { 
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,

} from '@angular/forms';

//import { IPersona } from '../../model/persona';
import { IRol } from '../../model/rol';
import { UsuarioService } from '../../service/usuario.service';
import { RolService } from '../../service/rol.service';
import { PersonaService } from '../../service/persona.service';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { IPersonaRequest } from '../../model/persona-request';
import { ITipoDocumento } from '../../model/tipo-documento';
import { TipoDocumentoService } from '../../service/tipo-documento.service';

declare var bootstrap: any;

@Component({
  selector: 'app-visualizar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './visualizar-cliente.component.html',
  styleUrl: './visualizar-cliente.component.css'
})
export class VisualizarClienteComponent {
  modalEditarClienteInstance: any;

  usuarioArray: IUsuarioResponse[] = [];
  tipoDocArray: ITipoDocumento[] = [];
  personaArray: IUsuarioResponse[] = [];
  usuarioRequest: IUsuarioRequest = {} as IUsuarioRequest;
  personaRequest: IPersonaRequest = {} as IPersonaRequest;
  usuarioForm: FormGroup;
  //personaArray: IPersona[] = [];
  rolArray: IRol[] = [];
  page: number = 1;
  isEdited: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private personaService: PersonaService,
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.usuarioForm = new FormGroup({
      idPersona: new FormControl(''),
      nroDocumento: new FormControl('', [Validators.required]),
      idTipoDocumento: new FormControl('1', [Validators.required]),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),

    });
  }
  setPersonaRequest():void {
    this.personaRequest.idPersona=this.usuarioForm.get('idPersona')?.value;
    this.personaRequest.nroDocumento=this.usuarioForm.get('nroDocumento')?.value;
    this.personaRequest.idTipoDoc=this.usuarioForm.get('idTipoDocumento')?.value;
    this.personaRequest.apellidoPaterno=this.usuarioForm.get('apellidoPaterno')?.value;
    this.personaRequest.apellidoMaterno=this.usuarioForm.get('apellidoMaterno')?.value;
    this.personaRequest.nombres=this.usuarioForm.get('nombres')?.value;
    this.personaRequest.direccion=this.usuarioForm.get('direccion')?.value;
    this.personaRequest.sexo=this.usuarioForm.get('sexo')?.value;
    this.personaRequest.telefono=this.usuarioForm.get('telefono')?.value;

  }
  ngOnInit(): void {
    //this.getPersonas();
    //this.getRoles();
    this.getTipoDocumento();
    this.getUsuariosCLiente();// obtiene los usuarios correspondietes a personas con el rol 3(clientes)
  }
  getUsuariosCLiente(): void {
    this.usuarioService.getUsuarios().subscribe((result: any) => {
      // Filtrar solo los usuarios cuyo id_rol = 3
      this.usuarioArray = result.filter((usuario: IUsuarioResponse) => 
        usuario.rol?.idRol === 3
      );
    });    
    //this.usuarioService.getUsuarios().subscribe((result: any) => {
      //console.log('Result', result);
    //  this.usuarioArray = result;
    //});
  }
  getRoles() {
    this.rolService.getRoles().subscribe(
      (result: any) => {
        this.rolArray = result;
      },
      (err: any) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Advertencia....',
          text: '!Ah ocurrido un error al recuperar los tipos de roles!',
        });
      } //cierre del error
    );
  }
  getPersonas() {
    this.personaService.getPersonas().subscribe(
      (result: any) => {
        this.personaArray = result;
      },
      (err: any) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Advertencia....',
          text: '!Ah ocurrido un error al recuperar las personas!',
        });
      } //cierre del error
    );
  }
  eliminarCliente(usuarioResponse: IUsuarioResponse) {
    this.usuarioRequest.idUsuario = usuarioResponse.idUsuario;
    this.personaRequest.idPersona = usuarioResponse.persona.idPersona;
        Swal.fire({ 
          title: '¿Está seguro de de eliminar los datos del cliente?',
          showCancelButton: true,
          cancelButtonText: 'NO',
          confirmButtonText: 'Sí',
          focusCancel: true,
          text: 'Por favor espere',
          allowOutsideClick: false,
        }).then((result) => {
          if(result.isConfirmed) {
            this.eliminarPersona();
            this.eliminarUsuario();
          } 
          
    
        });


  }
  eliminarPersona():void {
      

      this.personaService.eliminarPersona(this.personaRequest).subscribe(
      (result: any) => {
        console.log('Persona eliminado con éxito', result);

      },
      (error) => {
        console.error('Error al eliminar la persona:', error);
        //this.errorMessage = 'Error al eliminar el usuario';

      }
    );
      
  }
  eliminarUsuario():void {
    
      this.usuarioService.eliminarUsuario(this.usuarioRequest).subscribe(
      (result: any) => {
        console.log('Usuario eliminado con éxito', result);
        this.ngOnInit();
        //this.successMessage = 'Usuario eliminado exitosamente';
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Eliminar Cliente',
          text: '¡Se elimino exitosamente el cliente seleccionado!',

        });
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
        //this.errorMessage = 'Error al eliminar el usuario';
        Swal.fire({
          icon: 'error',
          title: 'Advertencia',
          text: 'No se pudo eliminar el cliente',
        });
      }
    );

  }
  mostrarEditarCliente(usuarioResponse: IUsuarioResponse) {

    const modalElement = document.getElementById('modalEditarCliente')!;
    this.modalEditarClienteInstance = new bootstrap.Modal(modalElement);
    this.modalEditarClienteInstance.show();
    //const modal = new bootstrap.Modal(document.getElementById('modalEditarCliente')!);
   //modal.show();
    this.usuarioForm.patchValue({
      idPersona: usuarioResponse.persona.idPersona,
      nroDocumento: usuarioResponse.persona.nroDocumento,
      idTipoDocumento: usuarioResponse?.persona?.tipoDocumento?.idTipoDoc,
      apellidoPaterno: usuarioResponse.persona.apellidoPaterno,
      apellidoMaterno: usuarioResponse.persona.apellidoMaterno,
      nombres: usuarioResponse.persona.nombres,
      direccion: usuarioResponse.persona.direccion,
      sexo: usuarioResponse.persona.sexo,
      telefono: usuarioResponse.persona.telefono,

    });




  }
  confirmarEdicionCliente():void{  
        Swal.fire({ 
          title: '¿Está seguro de de editar los datos del cliente?',
          showCancelButton: true,
          cancelButtonText: 'NO',
          confirmButtonText: 'Sí',
          focusCancel: true,
          text: 'Por favor espere',
          allowOutsideClick: false,
        }).then((result) => {
          if(result.isConfirmed) {
            this.setPersonaRequest();

            this.actualizarPersona();
          } 
          
    
        });



  }
  actualizarPersona():void {
      this.personaService.actualizarPersona(this.personaRequest).subscribe(
      (result: any) => {
        this.ngOnInit();
          Swal.fire({
          icon: 'success',
          title: 'Editar Cliente',
          text: '¡Se edito exitosamente el cliente !',

        });
        console.log('Persona actualizado con éxito', result);
        if (this.modalEditarClienteInstance) {
            this.modalEditarClienteInstance.hide();
        }

      },
      (error) => {
          Swal.fire({
          icon: 'error',
          title:'Advertencia',
          text: 'No se pudo editar el cliente',
        });
        console.error('Error al actualizar la persona:', error);

      }
    );



  }
    getTipoDocumento():void{
      this.tipoDocumentoService.getTipoDocumentos().subscribe(
        (result: any) => {
          this.tipoDocArray = result;
          console.log('Tipo de documentos:', this.tipoDocArray);
        },
        (err:any) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los tipos de documentos',
          });
        }
      );


    }
    setTipoDocumento(event:Event):void{
      const inputChangeValue = (event.target as HTMLSelectElement).value;
      this.usuarioForm.controls['idTipoDocumento'].setValue(inputChangeValue);
    }  




}

import { Component } from '@angular/core';
import { IPersonaResponse } from '../../model/persona-response';
import { IPersonaRequest } from '../../model/persona-request';
import { ITipoDocumento } from '../../model/tipo-documento';
import { CommonModule } from '@angular/common';
import { 
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,

} from '@angular/forms';
import { PersonaService } from '../../service/persona.service';
import { TipoDocumentoService } from '../../service/tipo-documento.service';
import { UsuarioService } from '../../service/usuario.service';
import { IUsuarioRequest } from '../../model/usuario-request';
import { IUsuarioResponse } from '../../model/usuario-response';

@Component({
  selector: 'app-ingresar-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingresar-clientes.component.html',
  styleUrl: './ingresar-clientes.component.css'
})
export class IngresarClientesComponent {

  successMessage: string = ''; // Mensaje de éxito
  errorMessage: string = ''; // Mensaje de error


  //personaArray: IPersonaResponse[] = [];
  personaRequest:IPersonaRequest ={} as IPersonaRequest
  usuarioRequest:IUsuarioRequest ={} as IUsuarioRequest
  personaForm: FormGroup;
  tipoDocArray:ITipoDocumento[] =[];
  isEdited: boolean = false;
  constructor(
     private personaService: PersonaService,
     private tipoDocService: TipoDocumentoService, 
     private usuarioService: UsuarioService
  ) {
    this.personaForm = new FormGroup({
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
    this.personaRequest.idPersona=this.personaForm.get('idPersona')?.value;
    this.personaRequest.nroDocumento=this.personaForm.get('nroDocumento')?.value;
    this.personaRequest.idTipoDoc=this.personaForm.get('idTipoDocumento')?.value;
    this.personaRequest.apellidoPaterno=this.personaForm.get('apellidoPaterno')?.value;
    this.personaRequest.apellidoMaterno=this.personaForm.get('apellidoMaterno')?.value;
    this.personaRequest.nombres=this.personaForm.get('nombres')?.value;
    this.personaRequest.direccion=this.personaForm.get('direccion')?.value;
    this.personaRequest.sexo=this.personaForm.get('sexo')?.value;
    this.personaRequest.telefono=this.personaForm.get('telefono')?.value;

  }
  setUsuarioRequest(idPersona: number):void {
    
    this.usuarioRequest.nombreUsuario="pedro";
    this.usuarioRequest.password="pedro";
    this.usuarioRequest.idRol=3;
    this.usuarioRequest.idPersona=idPersona
  }
  registrarCliente(): void{
    this.setPersonaRequest();
    //console.log("Método registrarCliente() invocado");
    this.registrarPersonaUsuario();
 
    //Registrar Persona

  }
  registrarPersonaUsuario(): void {

    
        this.personaService.registrarPersona(this.personaRequest).subscribe({
        next: (respuesta: IPersonaResponse) => {
        console.log('ID de persona creada:', respuesta.idPersona);
        
        // Ahora que tenemos el idPersona, vamos a crear un usuario
        this.registrarUsuario(respuesta.idPersona);
      },
      error: (error) => {
        console.error('Error al registrar persona:', error);
      }
    });

 

  }
    registrarUsuario(idPersona: number): void {
      this.setUsuarioRequest(idPersona);
    // Creamos un objeto de tipo IUsuarioRequest para registrar el usuario


    // Llamamos al servicio para registrar el usuario
    this.usuarioService.registrarUsuario(this.usuarioRequest).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito', response);
        this.successMessage = 'Usuario y persona registrados exitosamente';
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        this.errorMessage = 'Error al registrar el usuario';
      }
    });
    }

    ngOnInit() {
    //this.getPersonas();
    this.personaForm.controls['idTipoDocumento'].setValue(1);
    
    }






  
  /*getPersonas(){
    this.personaService.getPersonas().subscribe((result: any) => {
      //console.log('Result', result);
    this.personaArray = result;
    });
  }*/
   

}

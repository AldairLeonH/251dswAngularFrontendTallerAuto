import { Component } from '@angular/core';
import { IUsuarioResponse } from '../../model/usuario-response';
import { IUsuarioRequest } from '../../model/usuario-request';
import { CommonModule } from '@angular/common';
import { 
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,

} from '@angular/forms';

import { IPersona } from '../../model/persona';
import { IRol } from '../../model/rol';
import { UsuarioService } from '../../service/usuario.service';
import { RolService } from '../../service/rol.service';
import { PersonaService } from '../../service/persona.service';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-visualizar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './visualizar-cliente.component.html',
  styleUrl: './visualizar-cliente.component.css'
})
export class VisualizarClienteComponent {
  usuarioArray: IUsuarioResponse[] = [];
  usuarioRequest: IUsuarioRequest = {} as IUsuarioRequest;
  usuarioForm: FormGroup;
  personaArray: IPersona[] = [];
  rolArray: IRol[] = [];
  page: number = 1;
  isEdited: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private personaService: PersonaService
  ) {
    this.usuarioForm = new FormGroup({
      idUsuario: new FormControl(''),
      nombreUsuario: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),

      idRol: new FormControl('3', [Validators.required]),
      idPersona: new FormControl('14', [Validators.required]),
    });
  }
  ngOnInit(): void {
    //this.getPersonas();
    //this.getRoles();
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
        this.rolArray = result;
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


}

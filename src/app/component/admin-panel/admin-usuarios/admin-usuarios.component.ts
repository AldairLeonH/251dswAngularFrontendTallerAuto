import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '@service/usuario.service';
import { PersonaService } from '@service/persona.service';
import { RolService } from '@service/rol.service';
import { IUsuarioResponse } from '@model/usuario-response';
import { IUsuarioRequest } from '@model/usuario-request';
import { IPersona } from '@model/persona';
import { IRol } from '@model/rol';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-usuarios-container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0"><i class="fas fa-users me-2"></i>Usuarios</h2>
        <button class="btn btn-primary" (click)="abrirModalAgregar()"><i class="fas fa-plus me-2"></i>Agregar usuario</button>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Buscar usuario..." [(ngModel)]="busqueda">
      </div>
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
      </div>
      <div class="table-responsive" *ngIf="!loading">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuariosFiltrados(); let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ getNombreCompleto(usuario) }}</td>
              <td>{{ usuario.nombreUsuario }}</td>
              <td>{{ usuario.persona.telefono || '-' }}</td>
              <td>{{ usuario.rol.rol }}</td>
              <td>Activo</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary me-2" (click)="abrirModalEditar(usuario)"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger" (click)="eliminarUsuario(usuario)"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Modal agregar/editar -->
      <div *ngIf="modalAbierto" class="modal-backdrop show d-block">
        <div class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.2);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editando ? 'Editar usuario' : 'Agregar usuario' }}</h5>
                <button type="button" class="btn-close" (click)="cerrarModal()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3" *ngIf="!editando">
                  <label class="form-label">Persona</label>
                  <select class="form-select" [(ngModel)]="usuarioForm.idPersona">
                    <option *ngFor="let persona of personas" [value]="persona.idPersona">
                      {{ persona.nombres }} {{ persona.apellidoPaterno }} {{ persona.apellidoMaterno }} ({{ persona.nroDocumento }})
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre de usuario</label>
                  <input type="text" class="form-control" [(ngModel)]="usuarioForm.nombreUsuario">
                </div>
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" [(ngModel)]="usuarioForm.estado">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <input type="text" class="form-control" [value]="getRolNombre(usuarioForm)" disabled>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
                <button type="button" class="btn btn-primary" (click)="guardarUsuario()">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-usuarios-container { max-width: 900px; margin: 0 auto; }
    .modal-backdrop { z-index: 1050; }
    .modal { z-index: 1060; }
  `]
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: IUsuarioResponse[] = [];
  personas: IPersona[] = [];
  roles: IRol[] = [];
  busqueda = '';
  loading = false;
  modalAbierto = false;
  editando = false;
  usuarioForm: any = {};

  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarPersonas();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  cargarPersonas() {
    this.personaService.getPersonas().subscribe({
      next: (personas) => { this.personas = personas; },
      error: () => {}
    });
  }

  cargarRoles() {
    this.rolService.getRoles().subscribe({
      next: (roles) => { this.roles = roles; },
      error: () => {}
    });
  }

  usuariosFiltrados() {
    return this.usuarios.filter(u =>
      this.getNombreCompleto(u).toLowerCase().includes(this.busqueda.toLowerCase()) ||
      u.nombreUsuario.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  getNombreCompleto(usuario: IUsuarioResponse) {
    if (!usuario.persona) return '';
    return `${usuario.persona.nombres} ${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`;
  }

  getRolNombre(usuario: any) {
    if (usuario.rol) return usuario.rol.rol;
    if (usuario.idRol) {
      const rol = this.roles.find(r => r.idRol === usuario.idRol);
      return rol ? rol.rol : '';
    }
    return '';
  }

  abrirModalAgregar() {
    this.editando = false;
    this.usuarioForm = { nombreUsuario: '', idPersona: '', estado: 'Activo', idRol: 3 };
    // Por defecto, idRol 3 (cliente), puedes ajustar según lógica de negocio
    this.modalAbierto = true;
  }

  abrirModalEditar(usuario: IUsuarioResponse) {
    this.editando = true;
    this.usuarioForm = {
      idUsuario: usuario.idUsuario,
      nombreUsuario: usuario.nombreUsuario,
      idPersona: usuario.persona?.idPersona,
      estado: 'Activo',
      idRol: usuario.rol?.idRol
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarUsuario() {
    if (this.editando) {
      // Solo actualiza nombreUsuario y estado
      const req: IUsuarioRequest = {
        idUsuario: this.usuarioForm.idUsuario,
        nombreUsuario: this.usuarioForm.nombreUsuario,
        password: '', // No se cambia
        idRol: this.usuarioForm.idRol,
        idPersona: this.usuarioForm.idPersona
      };
      this.usuarioService.actualizarUsuario(req).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: () => { alert('Error al actualizar usuario'); }
      });
    } else {
      // Crear usuario nuevo
      const req: IUsuarioRequest = {
        nombreUsuario: this.usuarioForm.nombreUsuario,
        password: '123456', // Contraseña por defecto
        idRol: this.usuarioForm.idRol,
        idPersona: this.usuarioForm.idPersona
      };
      this.usuarioService.registrarUsuario(req).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: () => { alert('Error al registrar usuario'); }
      });
    }
  }

  eliminarUsuario(usuario: IUsuarioResponse) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      const req: IUsuarioRequest = {
        idUsuario: usuario.idUsuario,
        nombreUsuario: usuario.nombreUsuario,
        password: '',
        idRol: usuario.rol?.idRol,
        idPersona: usuario.persona?.idPersona
      };
      this.usuarioService.eliminarUsuario(req).subscribe({
        next: () => { this.cargarUsuarios(); },
        error: () => { alert('Error al eliminar usuario'); }
      });
    }
  }
} 
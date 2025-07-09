import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { ServiciosCrudComponent } from './servicios-crud/servicios-crud.component';
import { AdminMaterialesComponent } from './admin-materiales.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, AdminUsuariosComponent, ServiciosCrudComponent, AdminMaterialesComponent, DashboardComponent],
  template: `
    <div class="admin-panel-container d-flex" style="min-height: 100vh;">
      <nav class="admin-sidebar bg-dark text-white p-3" style="width: 220px;">
        <h5 class="mb-4 text-warning"><i class="fas fa-cogs me-2"></i>Administración</h5>
        <ul class="nav flex-column gap-2">
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='dashboard'" (click)="tab='dashboard'"><i class="fas fa-chart-bar me-2"></i>Dashboard</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='usuarios'" (click)="tab='usuarios'"><i class="fas fa-users me-2"></i>Usuarios</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='servicios'" (click)="tab='servicios'"><i class="fas fa-tools me-2"></i>Servicios</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='materiales'" (click)="tab='materiales'"><i class="fas fa-boxes me-2"></i>Materiales</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='autos'" (click)="tab='autos'"><i class="fas fa-car me-2"></i>Autos</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='encuestas'" (click)="tab='encuestas'"><i class="fas fa-clipboard-list me-2"></i>Encuestas</a></li>
          <li class="nav-item"><a class="nav-link text-white" [class.active]="tab==='roles'" (click)="tab='roles'"><i class="fas fa-user-shield me-2"></i>Roles</a></li>
        </ul>
      </nav>
      <main class="flex-grow-1 p-4 bg-light">
        <ng-container [ngSwitch]="tab">
          <div *ngSwitchCase="'dashboard'">
            <app-dashboard></app-dashboard>
          </div>
          <div *ngSwitchCase="'usuarios'">
            <app-admin-usuarios></app-admin-usuarios>
          </div>
          <div *ngSwitchCase="'servicios'">
            <app-servicios-crud></app-servicios-crud>
          </div>
          <div *ngSwitchCase="'materiales'">
            <app-admin-materiales></app-admin-materiales>
          </div>
          <div *ngSwitchCase="'autos'">
            <h2 class="mb-4"><i class="fas fa-car me-2"></i>Gestión de Autos</h2>
            <div class="alert alert-warning">CRUD de autos próximamente.</div>
          </div>
          <div *ngSwitchCase="'encuestas'">
            <h2 class="mb-4"><i class="fas fa-clipboard-list me-2"></i>Gestión de Encuestas</h2>
            <div class="alert alert-warning">CRUD de encuestas próximamente.</div>
          </div>
          <div *ngSwitchCase="'roles'">
            <h2 class="mb-4"><i class="fas fa-user-shield me-2"></i>Visualización de Roles</h2>
            <div class="alert alert-info">Aquí se mostrarán los roles del sistema.</div>
          </div>
        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    .admin-sidebar .nav-link.active {
      background: #ffc107;
      color: #212529 !important;
      font-weight: bold;
      border-radius: 8px;
    }
    .admin-sidebar .nav-link {
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .admin-sidebar .nav-link:hover {
      background: #fff3cd;
      color: #212529 !important;
    }
    .admin-panel-container {
      min-height: 100vh;
    }
    main.bg-light {
      min-height: 100vh;
    }
  `]
})
export class AdminPanelComponent {
  tab: string = 'usuarios';
} 
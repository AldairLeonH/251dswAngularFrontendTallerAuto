import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  rol: string = '';
  nombre: string = '';
  nombreUsuario: string = '';
  ngOnInit(): void {
      if (typeof window !== 'undefined') {
    this.rol = localStorage.getItem('rol') || 'rol';
    this.nombre = localStorage.getItem('nombreCompleto') || 'juan';
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'user';
      }
  }
}
import { HttpClientModule } from '@angular/common/http';
import { Component, inject,TemplateRef,ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { AuthService } from '@service/auth.service';
import { Location } from '@angular/common';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {
  authService = inject(AuthService);
  location = inject(Location);
  toastService = inject(ToastService);
  router = inject(Router);
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;


  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  login() {
    console.log(this.form.value);
    if (this.form.invalid) {
      console.log('form invalid')
      return; 
    }

    if (!this.form.value.email || !this.form.value.password) {
      console.log('email or password missing')
      return;
    }

    this.authService.login(this.form.value.email, this.form.value.password).subscribe(
      response => {
        this.toastService.show('Ingreso exitoso', 'success');
        console.log('Login successful', response);
        this.router.navigate(['/perfil']);
        //const rol = response.usuario.rol.toLowerCase(); // ← aseguramos comparación en minúsculas
        //localStorage.setItem('rol', rol); // guarda el nombre del rol si lo necesitas después
        const rol = Number(localStorage.getItem('rol'));
        //if (rol === 'tecnico') {
          //this.router.navigate(['/menu-tecnico']);
        //} else if (rol === 'recepcionista') {
          //this.router.navigate(['/perfil']);
        //} else if (rol === 'cliente') {
          //this.router.navigate(['/testeo']);
        //} else {
          //this.toastService.show('Rol no reconocido', 'danger');
        //} 
      },
      error => { 
        let mensaje: string;

              if (typeof error.error === 'string') {
                mensaje = error.error;
              } else if (typeof error.error === 'object' && error.error !== null) {
                mensaje = error.error.message || error.error.error || 'Error desconocido';
              } else {
                mensaje = error.message || 'Error inesperado';
              }

        this.toastService.show(`Ingreso fallido. ${mensaje}`, 'danger');
        console.error('Login failed', mensaje);
      }
    );
  }

  onBack() {
    this.location.back();
  }
    registrarse() {
    this.router.navigate(['/registrar-cliente']); 
  }
}
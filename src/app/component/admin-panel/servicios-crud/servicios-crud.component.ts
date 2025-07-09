import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioService, IServicioRequest } from '../../../service/servicio.service';
import { IServicioResponse } from '../../../model/servicio-response';

interface Servicio extends IServicioResponse {
  descripcion?: string;
  estado?: boolean;
}

@Component({
  selector: 'app-servicios-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './servicios-crud.component.html',
  styleUrls: ['./servicios-crud.component.css']
})
export class ServiciosCrudComponent implements OnInit {
  servicios: Servicio[] = [];
  servicioForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  isLoading = false;
  showForm = false;

  constructor(
    private servicioService: ServicioService,
    private fb: FormBuilder
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.isLoading = true;
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.isLoading = false;
      }
    });
  }

  showAddForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.servicioForm.reset();
    this.showForm = true;
  }

  showEditForm(servicio: Servicio): void {
    this.isEditing = true;
    this.editingId = servicio.id || null;
    this.servicioForm.patchValue({
      nombre: servicio.nombre,
      precio: servicio.precio
    });
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.servicioForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  onSubmit(): void {
    if (this.servicioForm.valid) {
      const servicioData = this.servicioForm.value;
      
      if (this.isEditing && this.editingId) {
        // Actualizar servicio existente
        servicioData.id = this.editingId;
        this.servicioService.actualizarServicio(servicioData).subscribe({
          next: () => {
            this.loadServicios();
            this.cancelForm();
            this.showToast('Servicio actualizado exitosamente', 'success');
          },
          error: (error) => {
            console.error('Error actualizando servicio:', error);
            this.showToast('Error al actualizar el servicio', 'error');
          }
        });
      } else {
        // Crear nuevo servicio
        this.servicioService.crearServicio(servicioData).subscribe({
          next: () => {
            this.loadServicios();
            this.cancelForm();
            this.showToast('Servicio creado exitosamente', 'success');
          },
          error: (error: any) => {
            console.error('Error creando servicio:', error);
            this.showToast('Error al crear el servicio', 'error');
          }
        });
      }
    }
  }

  deleteServicio(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          this.loadServicios();
          this.showToast('Servicio eliminado exitosamente', 'success');
        },
        error: (error: any) => {
          console.error('Error eliminando servicio:', error);
          this.showToast('Error al eliminar el servicio', 'error');
        }
      });
    }
  }



  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    // Implementar notificación toast
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  getFieldError(fieldName: string): string {
    const field = this.servicioForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return 'El valor debe ser mayor a 0';
    }
    return '';
  }
} 
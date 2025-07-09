import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '@service/material.service';
import { IMaterialResponse } from '@model/material-response';

@Component({
  selector: 'app-admin-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Gestión de Inventario de Materiales</h2>
      <button class="btn btn-primary mb-3" (click)="abrirFormulario()">Agregar Material</button>
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let material of materiales">
            <td>{{ material.id }}</td>
            <td>{{ material.nombre }}</td>
            <td>
              <span *ngIf="!editandoStock[material.id]">{{ material.stock }}</span>
              <input *ngIf="editandoStock[material.id]" type="number" [(ngModel)]="nuevoStock[material.id]" class="form-control" style="width: 100px; display: inline-block;" />
              <button *ngIf="!editandoStock[material.id]" class="btn btn-sm btn-outline-secondary ms-2" (click)="editarStock(material)">Editar</button>
              <button *ngIf="editandoStock[material.id]" class="btn btn-sm btn-success ms-2" (click)="guardarStock(material)">Guardar</button>
              <button *ngIf="editandoStock[material.id]" class="btn btn-sm btn-danger ms-2" (click)="cancelarEdicionStock(material)">Cancelar</button>
            </td>
            <td>{{ material.precio | currency:'PEN' }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" (click)="abrirFormulario(material)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="eliminarMaterial(material.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario modal -->
      <div *ngIf="mostrarFormulario" class="modal-backdrop show" style="z-index: 1040;"></div>
      <div *ngIf="mostrarFormulario" class="modal d-block" tabindex="-1" style="z-index: 1050;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ materialSeleccionado ? 'Editar Material' : 'Agregar Material' }}</h5>
              <button type="button" class="btn-close" (click)="cerrarFormulario()"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="guardarMaterial()">
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input id="nombre" class="form-control" [(ngModel)]="formMaterial.nombre" name="nombre" required />
                </div>
                <div class="mb-3">
                  <label for="stock" class="form-label">Stock</label>
                  <input id="stock" type="number" class="form-control" [(ngModel)]="formMaterial.stock" name="stock" required min="0" />
                </div>
                <div class="mb-3">
                  <label for="precio" class="form-label">Precio</label>
                  <input id="precio" type="number" class="form-control" [(ngModel)]="formMaterial.precio" name="precio" required min="0" step="0.01" />
                </div>
                <button type="submit" class="btn btn-primary">Guardar</button>
                <button type="button" class="btn btn-secondary ms-2" (click)="cerrarFormulario()">Cancelar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminMaterialesComponent implements OnInit {
  materiales: IMaterialResponse[] = [];
  mostrarFormulario = false;
  materialSeleccionado: IMaterialResponse | null = null;
  formMaterial: Partial<IMaterialResponse> = {};
  editandoStock: { [id: number]: boolean } = {};
  nuevoStock: { [id: number]: number } = {};

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales() {
    this.materialService.getMateriales().subscribe(data => {
      this.materiales = data;
    });
  }

  abrirFormulario(material?: IMaterialResponse) {
    this.mostrarFormulario = true;
    if (material) {
      this.materialSeleccionado = material;
      this.formMaterial = { ...material };
    } else {
      this.materialSeleccionado = null;
      this.formMaterial = { nombre: '', stock: 0, precio: 0 };
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.materialSeleccionado = null;
    this.formMaterial = {};
  }

  guardarMaterial() {
    if (this.materialSeleccionado) {
      // Editar
      this.materialService.updateMaterial(this.materialSeleccionado.id, this.formMaterial).subscribe(() => {
        this.cargarMateriales();
        this.cerrarFormulario();
      });
    } else {
      // Crear
      this.materialService.createMaterial(this.formMaterial).subscribe(() => {
        this.cargarMateriales();
        this.cerrarFormulario();
      });
    }
  }

  eliminarMaterial(id: number) {
    if (confirm('¿Seguro que deseas eliminar este material?')) {
      this.materialService.deleteMaterial(id).subscribe(() => {
        this.cargarMateriales();
      });
    }
  }

  // Gestión de stock
  editarStock(material: IMaterialResponse) {
    this.editandoStock[material.id] = true;
    this.nuevoStock[material.id] = material.stock;
  }

  guardarStock(material: IMaterialResponse) {
    const nuevoStock = this.nuevoStock[material.id];
    this.materialService.updateStock(material.id, nuevoStock).subscribe(() => {
      this.editandoStock[material.id] = false;
      this.cargarMateriales();
    });
  }

  cancelarEdicionStock(material: IMaterialResponse) {
    this.editandoStock[material.id] = false;
  }
} 
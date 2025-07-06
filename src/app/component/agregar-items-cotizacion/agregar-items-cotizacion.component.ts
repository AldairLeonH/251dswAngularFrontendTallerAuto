import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CotizacionService } from '@service/cotizacion.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-agregar-items-cotizacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-plus-circle me-2"></i>
          Agregar Items a Cotización #{{ cotizacionId }}
        </h5>
      </div>
      <div class="card-body">
        <!-- Tabs para servicios y materiales -->
        <ul class="nav nav-tabs mb-3" id="itemsTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="servicios-tab" data-bs-toggle="tab" 
                    data-bs-target="#servicios" type="button" role="tab">
              <i class="bi bi-tools me-2"></i>Servicios
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="materiales-tab" data-bs-toggle="tab" 
                    data-bs-target="#materiales" type="button" role="tab">
              <i class="bi bi-box me-2"></i>Materiales
            </button>
          </li>
        </ul>

        <div class="tab-content" id="itemsTabContent">
          <!-- Tab Servicios -->
          <div class="tab-pane fade show active" id="servicios" role="tabpanel">
            <form [formGroup]="servicioForm" (ngSubmit)="agregarServicio()">
              <div class="row">
                <div class="col-md-6">
                  <label for="idServicio" class="form-label">Servicio</label>
                  <select class="form-select" id="idServicio" formControlName="idServicio">
                    <option value="">Seleccionar servicio...</option>
                    <option *ngFor="let servicio of servicios" [value]="servicio.id">
                      {{ servicio.nombre }} - S/ {{ servicio.precio | number:'1.2-2' }}
                    </option>
                  </select>
                  <div *ngIf="servicioForm.get('idServicio')?.invalid && servicioForm.get('idServicio')?.touched" 
                       class="text-danger small">
                    Debe seleccionar un servicio
                  </div>
                </div>
                <div class="col-md-6 d-flex align-items-end">
                  <button type="submit" class="btn btn-primary" [disabled]="servicioForm.invalid || loading">
                    <i class="bi bi-plus-circle me-2"></i>
                    Agregar Servicio
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Tab Materiales -->
          <div class="tab-pane fade" id="materiales" role="tabpanel">
            <form [formGroup]="materialForm" (ngSubmit)="agregarMaterial()">
              <div class="row">
                <div class="col-md-4">
                  <label for="idMaterial" class="form-label">Material</label>
                  <select class="form-select" id="idMaterial" formControlName="idMaterial">
                    <option value="">Seleccionar material...</option>
                    <option *ngFor="let material of materiales" [value]="material.id">
                      {{ material.nombre }} (Stock: {{ material.stock }})
                    </option>
                  </select>
                  <div *ngIf="materialForm.get('idMaterial')?.invalid && materialForm.get('idMaterial')?.touched" 
                       class="text-danger small">
                    Debe seleccionar un material
                  </div>
                </div>
                <div class="col-md-4">
                  <label for="cantidad" class="form-label">Cantidad</label>
                  <input type="number" class="form-control" id="cantidad" 
                         formControlName="cantidad" min="1">
                  <div *ngIf="materialForm.get('cantidad')?.invalid && materialForm.get('cantidad')?.touched" 
                       class="text-danger small">
                    <span *ngIf="materialForm.get('cantidad')?.errors?.['required']">Cantidad requerida</span>
                    <span *ngIf="materialForm.get('cantidad')?.errors?.['min']">Mínimo 1</span>
                  </div>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                  <button type="submit" class="btn btn-success" [disabled]="materialForm.invalid || loading">
                    <i class="bi bi-plus-circle me-2"></i>
                    Agregar Material
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

                 <!-- Resultado de la operación -->
         <div *ngIf="resultadoOperacion" class="mt-3">
           <div class="alert" [ngClass]="{
             'alert-success': resultadoOperacion.exito,
             'alert-danger': !resultadoOperacion.exito
           }">
             <i class="bi" [ngClass]="{
               'bi-check-circle': resultadoOperacion.exito,
               'bi-exclamation-triangle': !resultadoOperacion.exito
             }"></i>
             {{ resultadoOperacion.mensaje }}
           </div>
         </div>

         <!-- Botón de volver -->
         <div class="mt-3">
           <button class="btn btn-secondary" (click)="volverALista()">
             <i class="bi bi-arrow-left me-2"></i>
             Volver a la lista
           </button>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
    }
    
    .nav-tabs .nav-link {
      border-radius: 0.375rem 0.375rem 0 0;
    }
    
    .form-select, .form-control {
      border-radius: 0.375rem;
    }
    
    .btn {
      border-radius: 0.375rem;
    }
  `]
})
export class AgregarItemsCotizacionComponent implements OnInit {
  @Input() cotizacionId!: number;
  @Output() itemAgregado = new EventEmitter<void>();

  servicioForm: FormGroup;
  materialForm: FormGroup;
  loading = false;
  resultadoOperacion: { exito: boolean; mensaje: string } | null = null;
  cotizacionIdFromRoute: number = 0;

  // Datos de ejemplo - en un caso real vendrían de servicios
  servicios = [
    { id: 1, nombre: 'Cambio de aceite', precio: 50.00 },
    { id: 2, nombre: 'Revisión general', precio: 80.00 },
    { id: 3, nombre: 'Cambio de filtros', precio: 30.00 }
  ];

  materiales = [
    { id: 1, nombre: 'Aceite de motor', stock: 50 },
    { id: 2, nombre: 'Filtro de aceite', stock: 25 },
    { id: 3, nombre: 'Filtro de aire', stock: 30 }
  ];

  constructor(
    private fb: FormBuilder,
    private cotizacionService: CotizacionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.servicioForm = this.fb.group({
      idServicio: ['', Validators.required]
    });

    this.materialForm = this.fb.group({
      idMaterial: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // Obtener el ID de la cotización desde la ruta
    this.route.params.subscribe(params => {
      this.cotizacionIdFromRoute = +params['id'];
      if (this.cotizacionIdFromRoute && !this.cotizacionId) {
        this.cotizacionId = this.cotizacionIdFromRoute;
      }
    });

    // Aquí se cargarían los servicios y materiales desde el backend
    this.cargarServicios();
    this.cargarMateriales();
  }

  cargarServicios(): void {
    // Implementar carga de servicios desde el backend
    // this.servicioService.getServicios().subscribe(...)
  }

  cargarMateriales(): void {
    // Implementar carga de materiales desde el backend
    // this.materialService.getMateriales().subscribe(...)
  }

  agregarServicio(): void {
    if (this.servicioForm.invalid) return;

    this.loading = true;
    this.resultadoOperacion = null;

    const request = {
      idCotizacion: this.cotizacionId,
      idServicio: this.servicioForm.value.idServicio
    };

    this.cotizacionService.agregarServicio(request).subscribe({
      next: (response) => {
        this.resultadoOperacion = {
          exito: true,
          mensaje: 'Servicio agregado correctamente'
        };
        this.toastService.show('Servicio agregado correctamente', 'success');
        this.servicioForm.reset();
        this.itemAgregado.emit();
        this.loading = false;
        
        // Opcional: redirigir después de agregar
        setTimeout(() => {
          this.router.navigate(['/cotizaciones/ver-cotizaciones']);
        }, 1500);
      },
      error: (err) => {
        this.resultadoOperacion = {
          exito: false,
          mensaje: 'Error al agregar el servicio: ' + (err.error?.message || 'Error desconocido')
        };
        this.toastService.show('Error al agregar el servicio', 'danger');
        this.loading = false;
      }
    });
  }

  agregarMaterial(): void {
    if (this.materialForm.invalid) return;

    this.loading = true;
    this.resultadoOperacion = null;

    const request = {
      idCotizacion: this.cotizacionId,
      idMaterial: this.materialForm.value.idMaterial,
      cantidad: this.materialForm.value.cantidad
    };

    this.cotizacionService.agregarMaterial(request).subscribe({
      next: (response) => {
        this.resultadoOperacion = {
          exito: true,
          mensaje: 'Material agregado correctamente'
        };
        this.toastService.show('Material agregado correctamente', 'success');
        this.materialForm.reset({ cantidad: 1 });
        this.itemAgregado.emit();
        this.loading = false;
        
        // Opcional: redirigir después de agregar
        setTimeout(() => {
          this.router.navigate(['/cotizaciones/ver-cotizaciones']);
        }, 1500);
      },
      error: (err) => {
        this.resultadoOperacion = {
          exito: false,
          mensaje: 'Error al agregar el material: ' + (err.error?.message || 'Error desconocido')
        };
        this.toastService.show('Error al agregar el material', 'danger');
        this.loading = false;
      }
    });
  }

  volverALista(): void {
    this.router.navigate(['/cotizaciones/ver-cotizaciones']);
  }
} 